from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database import Base, engine
from backend.app.middleware.logging_middleware import LoggingMiddleware

# ✅ Import routers (ONLY ONCE)
from backend.app.routes import alerts, auth, audit, analytics, banking

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Security Monitoring System")

# ✅ Logging Middleware
app.add_middleware(LoggingMiddleware)

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers (ONLY ONCE EACH)
app.include_router(alerts.router)
app.include_router(auth.router)
app.include_router(audit.router)
app.include_router(analytics.router)
app.include_router(banking.router)

# =========================
# ✅ TEST APIs
# =========================

@app.get("/")
def home():
    return {"message": "Backend Running with Database"}

@app.get("/test-db")
def test_db():
    try:
        connection = engine.connect()
        connection.close()
        return {"database": "Connected Successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
def health_check():
    return {"status": "OK"}

