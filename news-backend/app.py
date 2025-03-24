from fastapi import FastAPI, HTTPException
import redis.asyncio as redis
import httpx
import json
import hashlib
import time

API_KEY = "9af3ad0aa13947a5939715e0f52e495b"

app = FastAPI()


@app.on_event("startup")
async def startup():
    """Initialize Redis connection"""
    try:
        app.state.redis = redis.Redis(host="localhost", port=6379, decode_responses=True)
        await app.state.redis.ping()
        print("✅ Redis connected successfully")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        app.state.redis = None


@app.on_event("shutdown")
async def shutdown():
    """Close Redis connection"""
    if app.state.redis:
        await app.state.redis.close()


async def fetch_news(query: str):
    """Fetch news from API and store in Redis"""
    url = (
        f"https://newsapi.org/v2/everything?q={query}&from=2025-03-20&sortBy=popularity&apiKey={API_KEY}"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code == 200:
        news_articles = response.json().get("articles", [])

        redis_client = app.state.redis

        for article in news_articles:
            data = f"{article['title']}-{article['url']}-{article['description']}-{article['content']}-{article['publishedAt']}-{article['author']}"
            hash_object = hashlib.sha256(data.encode())
            article_id = str(hash_object.hexdigest()[:10])  # Shorten hash

            article["id"] = article_id  # Assign ID
            article_json = json.dumps(article, indent=4, sort_keys=True, default=str)

            # Store article in Redis
            await redis_client.set(f"article_{article_id}", article_json, ex=300)

        return news_articles

    else:
        raise HTTPException(status_code=500, detail="Failed to fetch data from API")


@app.get("/news")
async def get_articles_by_query(query: str = "default"):
    """Fetch news by query (from cache or API)"""
    redis_client = app.state.redis

    if not redis_client:
        raise HTTPException(status_code=500, detail="Redis is not available")

    query = query.replace(" ", "+").lower()
    cache_key = f"query_{query}"

    cached_query = await redis_client.get(cache_key)

    if cached_query:
        print("From cache:")
        return json.loads(cached_query)

    news_articles = await fetch_news(query)
    await redis_client.set(cache_key, json.dumps(news_articles), ex=300)

    print("From API:")
    return news_articles


@app.get("/news/{article_id}")
async def get_article(article_id: str):
    """Fetch a single article from Redis"""
    redis_client = app.state.redis

    if not redis_client:
        raise HTTPException(status_code=500, detail="Redis is not available")

    cached_article = await redis_client.get(f"article_{article_id}")

    if cached_article:
        print("From cache:")
        return json.loads(cached_article)

    raise HTTPException(status_code=404, detail="Article not found")
