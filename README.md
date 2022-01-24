# student-management-backend

## API Documentation

### Register API
* Endpoint: `POST /api/register`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
    ```
    {
        "tutor": "tutorken@gmail.com"
        "students": [
            "studentholt@gmail.com",
            "studentjohn@gmail.com        
        ]
    }
    ```

### Get Common Students API
* Endpoint: `GET /api/getcommonstudents`
* Success response status: HTTP 200
* Request example 1: `GET /api/getcommonstudents?tutor=tutorken%40gmail.com`
* Success response body 1:
    ```
    {
        "students": [
            "common_student_1@gmail.com",
            "common_student_2@gmail.com",
            "student_only_under_tutor_ken@gmail.com"     
        ]
    }
    ```
* Request example 2: `GET /api/getcommonsstudents?tutor=tutorken%40gmail.com&tutor=tutorjoe%40gmail.com`
* Success response body 1:
    ```
    {
        "students": [
            "common_student_1@gmail.com",
            "common_student_2@gmail.com"
        ]
    }
    ```

### Suspend Student API
* Endpoint: `POST /api/register`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
    ```
    {
        "student": "studentmary@gmail.com"
    }
    ```

### Retrieve Notifications API
* Endpoint: `POST /api/retrievenotifications`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 200
* Request body example 1:
    ```
    {
        "tutor": "tutorken@gmail.com",
        "notification": "Hello students! @studentanne@gmail.com @studentmary@gmail.com"
    }
    ```
* Success response body 1:
    ```
    {
        "recipients": [
            "@studentpeter@gmail.com",
            "@studentanne@gmail.com",
            "@studentmary@gmail.com"
        ]
    }
    ```
* Request body example 2:
    ```
    {
        "tutor": "tutorken@gmail.com",
        "notification": "Hey everyone"
    }
    ```
* Success response body 2:
    ```
    {
        "recipients": [
            "@studentpeter@gmail.com"
        ]
    }
    ```

## Setting up the project in your local device

### 1. Environment variables configuration
1. In the repository you will find sample .env files:
    - .env.sample (development)
    - .env.test.sample (testing)

2. Be sure to have your mysql server running locally

3. To use one (development or testing), just copy a sample and remove the '.sample' extension from the copy. **For example:** for the development config file, copy 'env.sample' to the same directory and rename it to '.env'

4. In the configuration file, set the variables that you will use for development/testing (e.g. PORT, database credentials, etc.)

### 2. Development
1. After setting up the env file for development, install the node_modules.
    ```
    npm install
    ```


2. run the following commands in your terminal (you should be inside the project file when running commands):
    1. Create database
        ```
        npm run db:create
        ```
        This command will create the database

    2. Migrate database
        ```
        npm run db:migrate
        ```
        This command will apply the migrations created under the *./src/migrations* folder

    3. Running the app
        ```
        npm run dev
        ```
        This command will run the application

### 3. Testing
1. Run test suite(s):
    ```
    npm run test
    ```
