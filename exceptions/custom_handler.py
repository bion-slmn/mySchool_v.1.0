from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    hanlders = {
        'ValidationError': _handle_generic_error,
        'PermissionDenied': _handle_generic_error,
        'NotAuthenticated': _handle_generic_error,
        'AuthenticationFailed': _handle_generic_error,
        'NotFound': _handle_generic_error,
        'MethodNotAllowed': _handle_generic_error,
     }
    
    exception_class = exc.__class__.__name__
    if exception_class in hanlders:
        return hanlders[exception_class](exc, context, response)
    return response

def _handle_generic_error(exc, context, response):
    print('response', exc)

    response.data = {
        'errors': response.data,
        'status': response.status_code
    }
    return response
    