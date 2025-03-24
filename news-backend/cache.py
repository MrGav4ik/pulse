import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_news(article_id, data):
    redis_client.set(f"news:{article_id}", data, ex=3600)