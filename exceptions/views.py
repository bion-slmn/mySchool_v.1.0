'''
handle 404 and 500 errors
'''
from django.http import JsonResponse
import traceback



def handle_404(request, exception):
    response = JsonResponse(
        {"error": "Resource not found"},
        status=404
    )
    response.status_code = 404
    return response

def handle_500(request):
    error_details = traceback.format_exc()
    print("Traceback of the error:", error_details) 
    return JsonResponse(
        {"error": "Internal server error"},
        status=500
    )