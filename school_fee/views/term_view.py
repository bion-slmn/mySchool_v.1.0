from ..models.term_model import Term
from rest_framework.response import Response
from django.http import HttpRequest
from ..decorator import handle_exceptions
from rest_framework.views import APIView
from ..serializers import TermSerializer
from rest_framework.permissions import AllowAny



class TermView(APIView):
    permission_classes = [AllowAny]
    @handle_exceptions
    def get(self, request: HttpRequest) -> Response:
        """
        Retrieves a list of all terms in the system.
        Args:
            request (HttpRequest): The HTTP request object.
        Returns:
            Response: A response containing the serialized term data.
        """
        status = request.query_params.get('status')
        year = request.query_params.get('year')
        
        terms = Term.objects.all()

        if status:
            terms = terms.filter(is_current=status)

        if year:
            terms = terms.filter(start_date__year=year)

        serializer = TermSerializer(terms, many=True)
        return Response(serializer.data)
        
    
    @handle_exceptions
    def post(self, request: HttpRequest) -> Response:
        """
        Creates a new term record based on the provided request data.
        Args:
            request (HttpRequest): The HTTP request object containing term data.
        Returns:
            Response: A response containing the serialized term data if successful,
            or error details.
        """
        serializer = TermSerializer(data=request.data)
        school = request.user.schools
       
        serializer.is_valid(raise_exception=True)
        term = serializer.save(school=school)
        print(term.is_current, term.school, 111111111)
        return Response(serializer.data, 201)
    
