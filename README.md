# AI Image Chatbot

This project provides an AI chatbot that can:

- Accept image uploads
- Generate a caption using BLIP-2
- Embed captions using BGE
- Store image + embedding in PostgreSQL + pgvector
- Accept text queries and run vector search to find matching images

---

## 🛠 Setup & Run

### 1. Database

- Ensure PostgreSQL is running
- Enable `vector` extension:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
