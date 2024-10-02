# GoogleMaps Challenge

I used Playwright with JavaScript for this challenge due to its built in reporter, making it easier to manage test results. 
Although I know how to use Cucumber, I opted not to use it to save time and focus on the main challenge since it wasn't explicitly mentioned.

_**>>> I included two additional happy path tests, one unhappy path test, one boundary test, and one non-functional test. You can read their Gherkin specifications [here](https://gist.github.com/hgcstr/59bae67df67ebde4487c0f9974b83b32).**_

I used the Page object model (POM) approach to facilitate code reuse in my test files, along with a utilities folder for helper functions. I used objects to store test variables directly in the file, although in a production context, they could be managed differently using data fixtures and environment variables for different environments.

Since the challenge involved a website we don’t have access to the code for, I had to interact with elements using locators that could break due to potential changes. I focused on using CSS selectors instead of hardcoded text to minimize flakiness (in a production scenario, I would prefer using test IDs). 

I included some waits for convenience since sometimes the URL or elements don’t change immediately. In a production environment, I would implement explicit waits at the element level to wait for specific behaviors or elements to appear.

The Playwright reporter has been added to capture images and videos on failure, and I focused on testing in Chrome for this challenge.


## Running tests locally

To run the tests locally, follow these steps:

1. Install Node.js and npm.

2. Install any additional dependencies using:
```
npm install
```

3. Install the necessary packages and Playwright using:
```
npm init playwright@latest
```

4. After installation, you can run the tests using:

```
npx playwright test
```

To view the generated report use:
```
npx playwright show-report
```

## Running tests with Docker

Make sure you have Docker installed and running on your machine and then follow these steps:

1. Navigate to the repo folder and execute:
```
docker build -t playwright-tests .
```

2. Execute the following command to run the tests:
```
docker run --rm -it -p 8080:8080 playwright-tests
```

Once the tests are finished open a browser in your local machine and go to 
```
http://localhost:8080
```

## Reference images
This is with a test failing on purpose to show the report in action
<img width="1092" alt="Screenshot 2024-09-22 at 18 43 46" src="https://github.com/user-attachments/assets/5273edbb-d201-43a9-9e48-c11af2be0576">

<img width="1110" alt="Screenshot 2024-09-22 at 18 45 41" src="https://github.com/user-attachments/assets/a61c14b1-1ad7-4bc1-aa80-81d56b72a26a">

<img width="870" alt="Screenshot 2024-09-22 at 18 46 17" src="https://github.com/user-attachments/assets/3893250d-1e81-48cf-8acf-f2bfe5fe78c4">






