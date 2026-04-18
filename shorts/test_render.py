import os
from fastapi.templating import Jinja2Templates
from fastapi import Request

# Mock request
class MockRequest:
    def __init__(self):
        self.scope = {"type": "http"}

templates = Jinja2Templates(directory="templates")
try:
    response = templates.TemplateResponse("index.html", {"request": MockRequest()})
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
