from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_news_update(news):
    producer.send('news_updates', value=news)
    producer.flush()

send_news_update({"title": "Breaking News!", "Category": "Politics"})