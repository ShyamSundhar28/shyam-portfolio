import os
from fastapi.templating import Jinja2Templates
from fastapi import Request

class MockRequest:
    def __init__(self):
        self.scope = {"type": "http"}

templates = Jinja2Templates(directory="templates")
try:
    # Trying the newer signature where request is a kwarg
    response = templates.TemplateResponse(name="index.html", context={}, request=MockRequest())
    print("Success with new signature")
except Exception as e:
    import traceback
    traceback.print_exc()
