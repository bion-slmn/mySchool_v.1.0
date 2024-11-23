# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

# This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## CREATE AN ADMIN

curl localhost:8000/api/user/register-admin/ -X POST -H 'Content-Type: application/json' -d '{"email": "bonfire@gmail.com", "role": "admin", "password": "newpassword123"}'
{"id":"dbc6ba6f-79f5-4da2-9988-fa7de14e9d91","date_joined":"2024-08-19","last_login":null,"role":"admin","is_superuser":false,"first_name":"","last_name":"","is_staff":false,}

## LOGIN

curl localhost:8000/api/user/login/ -H 'Content-Type: application/json' -d '{"email": "bonfire@gmail.com", "password": "newpassword123"}'

{
"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNDE1OTQ5MCwiaWF0IjoxNzI0MDczMDkwLCJqdGkiOiJiMDYxNzgwOGUxY2Q0YmZiYTYyOWVkMzFlYTYxMjljZiIsInVzZXJfaWQiOiJkYmM2YmE2Zi03OWY1LTRkYTItOTk4OC1mYTdkZTE0ZTlkOTEifQ.B_kjg1JaUGeNtHWKK0rrb2F_vlshtbWWthQOzY16k0c",
"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg"
}

## Register Teacher

curl localhost:8000/api/user/register-teacher/ \
-X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg" \
-d '{"email": "bonfire12@gmail.com", "role": "admin", "password": "newpassword123"}'

## CREATE A SCHOOL

curl localhost:8000/api/school/create-school/ -H 'Content-Type: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg" \-d '{"name": "bonfire school", "address": "my first school"}'

{"id":"056c3c3c-6a9d-4d82-924e-7f81533639bd","created_at":"2024-08-19","updated_at":"2024-08-19T13:47:24.243793Z","name":"bonfire school","address":"my first school","owner":"dbc6ba6f-79f5-4da2-9988-fa7de14e9d91"}

## CREATE A TERM

````curl localhost:8000/api/school/create-term/ -d '{"name": "Term 2 2024", "s
tart_date": "2024-09-09", "end_date": "2024-10-05"}' -H 'Content-Type: application/json' -H "Authorization: Bea
rer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODYxMDUxLCJpYXQiOjE3Mjc4N
Tc0NTEsImp0aSI6ImU3MGFhNDllZGUwMjQ2MmI4YmI4NjBlMjhkYzRkYWM0IiwidXNlcl9pZCI6ImRhYmUyNWQ5LWRjNzUtNDQ0MC1iM2Y4LWJm
MmNlMDYxZDRiZiIsIm5hbWUiOiIifQ.y8ElelOEs9GXXjqX861Iu6hjk8D2P64CzK7hIkicbVg" | jq```

```{
  "id": "00fc6c65-b75d-4af3-a37a-5176f63d40b3",
  "created_at": "2024-10-02",
  "updated_at": "2024-10-02",
  "name": "Term 3 2024",
  "start_date": "2024-09-09",
  "end_date": "2024-10-05",
  "is_current": true
}```

## GET ACTIVE TERM

curl localhost:8000/api/school/view-terms/?status=True | jq
[
  {
    "id": "0bbbd488-9c57-4bf0-b4bc-93d362729d0d",
    "created_at": "2024-10-02",
    "updated_at": "2024-10-02",
    "name": "Term 1 2024",
    "start_date": "2024-09-09",
    "end_date": "2024-10-05",
    "is_current": true
  },
  {
    "id": "1d0283ea-79b3-4842-992c-53fc4e92d45f",
    "created_at": "2024-10-02",
    "updated_at": "2024-10-02",
    "name": "Term 2 2024",
    "start_date": "2024-09-09",
    "end_date": "2024-10-05",
    "is_current": true
  },
  {
    "id": "00fc6c65-b75d-4af3-a37a-5176f63d40b3",
    "created_at": "2024-10-02",
    "updated_at": "2024-10-02",
    "name": "Term 3 2024",
    "start_date": "2024-09-09",
    "end_date": "2024-10-05",
    "is_current": true
  }
]

You can filter by year and status or year only
curl localhost:8000/api/school/view-terms/?status=True&year=2024


curl localhost:8000/api/school/create-grade/ -H 'Content-Type: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg" -d '{"name": "Grade 4", "description": "Grade 4 lead by me"}'

{"id":"a0a8be7f-c96e-4c95-853d-c41f5ec19635","created_at":"2024-08-19","updated_at":"2024-08-19T14:04:31.289046Z","name":"Grade 4","description":"Grade 4 lead by me","school":"056c3c3c-6a9d-4d82-924e-7f81533639bd"}

### CREATE A FEE

curl "http://localhost:8000/api/school/create-fee/2cb7351f-e606-4ada-a2c5-1286e9399188/" -H 'Content-Type: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDgxMDE4LCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6IjdiZThjMWUyMTFiMzRhYTk5MTA4YTQ5YTA2NGVmNzgzIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.Yn5qiFdQxvLdxY1VyZR68fjuHL3txCI34jf3C95VDVo" -d '{"name": "Grade 3 Sc fee", "total_amount": 12000,
"from_date": "2024-06-06", "to_date": "2024-07-05"}'

{
"id": "4690e9c3-724a-4b1c-bafe-1b618a52a5f9",
"from_date": "2024-06-06 00:00",
"to_date": "2024-07-05 00:00",
"created_at": "2024-08-19T14:27:45.621455Z",
"updated_at": "2024-08-19T14:27:45.621491Z",
"name": "Grade 3 Sc fee",
"total_amount": "12000.00",
"total_paid": "0.00",
"grade": "2cb7351f-e606-4ada-a2c5-1286e9399188",
"students": []
}

# make a payment

curl -X POST http://localhost:8000/api/school/create-payment/ -H "Content-Type: application/json" -d '{"student": "83c33d8a-456b-4f83-81fa-ebf6361218ea", "fee": "aa048e34-9602-4712-871d-165a6b2cc960", "amount": "210.00", "date_paid": "2024-08-29", "payment_method": "mpesa", "reference_number": "1234"}

# get details of a student

curl localhost:8000/api/school/get-student-detail/?id=ef0c3271-a30c-4ed0-aba1-535e7277226f | jq

````

{
"id": "ef0c3271-a30c-4ed0-aba1-535e7277226f",
"gender": "female",
"grade_name": "Baby",
"created_at": "2024-09-23T17:15:34.054135Z",
"name": "Avy",
"date_of_birth": "2024-09-05",
"grade": "e0eb028e-68ce-4a51-9bd0-b6a606d1ea8c",
"payment_info": {
"Term 3 baby class fee": {
"total": 250,
"payments": [
{
"amount": 250,
"date": "2024-09-23T17:18:19.831811Z"
}
]
}
}
}

## VIEW DAILY FEE
You can pass the option of created_at to select the date
```
curl localhost:8000/api/school/daily-fee/674e38c3-6178-49a0-b9e5-e315701eff27/

[
  {
    "id": "d18f2708-295a-437f-bd88-e9f9bbc175f9",
    "name": "grade 4 -- Term 3 2024 - DAILY Fee",
    "total_amount": 12
  },
  {
    "id": "dfb1b9f3-b312-4583-98cb-d374facb890a",
    "name": "Bion Solomon grade 4 - Term 1 2024 2024-10-14 Fee",
    "total_amount": 20
  }
]
```
