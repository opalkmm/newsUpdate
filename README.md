## Get news update with web scraper
**Hosted Live App: https://bangkok-update.onrender.com/ **

**What it is:** 

this data extraction application is built to update the latest news headlines and details of Bangkok Post newspaper.
I combined various framework and libraries, and make sure that the updates is able to deliver a concise and simple, yet responsive.
The users are able to leave comments on the new results, which will be stored in mongoDB.

**What I use:**
- Axios : perform GET requests on webpage to get back the HTML body (in this case, the BangkokPost website).
- Cheerio : parse markup from the response and provides an API for manipulating the resulting data structure. 
this is where I define the specific sections on HTML I would like to extract from. 
- Express : add specific handling for different HTTP request (e.g. GET, POST, DELETE, etc.), separately handle requests at different URL paths ("routes"), and serve static files (public/ index.html)
- Moongoose : create schemas for the title, links, and notes (users' comments), which will be stored in MongoDB. I like the ability to create relations in a non-relational database, which allows the database to be more flexible in case i'd like to scale this app further.
- HTML, CSS, with Bootstrap library to design the general look of the page.

**future implementation**
- include more news outlets for personal customization

<img width="1226" alt="Screen Shot 2021-05-11 at 2 36 24 PM" src="https://user-images.githubusercontent.com/26353108/194686108-ec19af7c-e369-4d1f-bec0-818253b42ccd.png">




