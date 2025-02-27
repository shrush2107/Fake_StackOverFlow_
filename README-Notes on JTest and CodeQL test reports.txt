On the JTest coverage report: 

Some rarely used routes in the controller were not covered in the JUnit Tests. Similarly, statements in the business logic
of the code that were unlikely to be triggered were ignored in favor of testing commonly used functions. 

Lines 40-54 in mockAuthMiddleware were deliberately excluded, as all code in this file was used 
solely for the purposes of testing and had no impact on the final product.

On the CodeQL report: 

As seen in "preGeneratedReport.sarif" file, CodeQL identified security threats in the application file, as well as the test files.
We believe that the threats in the test files can be safely ignored, as the tests are not meant to be secure anyways. 
Further, the errors in the application file mistakenly points to inputs such as 'aid' and 'qid' as user inputs. 
These inputs are passed without any user text input, often as a consequence of them clicking on a question or 
answer. Therefore, this didn't seem like a high-risk vulnerability, and actual user inputs were sanitized before any interaction
was made with the database.