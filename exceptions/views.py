from django.http import JsonResponse

def custom_404_handler(request, exception):
    """
    Custom 404 error handler.

    Args:
        request (HttpRequest): The request object.
        exception (Exception): The exception raised.

    Returns:
        JsonResponse: A JSON response with a 404 status.
    """
    return JsonResponse(
        {
            "status": "error",
            "status_code": 404,
            "message": "The requested resource was not found.",
            "path": request.path,
        },
        status=404
    )
