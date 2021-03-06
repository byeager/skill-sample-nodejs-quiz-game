'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = "amzn1.ask.skill.2062d651-9b37-41af-af04-2ffcb7e434a5";

//This function returns a descriptive sentence about your data.  Before a user starts a quiz, they can ask about a specific data element,
//like a copmany.  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item)
{
  switch(item.Status)
  {
      case "Active":
          var sentence = item.Name + " particpated in the Techstars " + item.Session + " program. They are based in " + item.City + " and have raised " + item.Funding + " dollars in funding. Which other Techstars company would you like to know about?";
          return sentence;
      break;
      case "Failed":
          var sentence = item.Name + " particpated in the Techstars " + item.Session + " program. They raised " + item.Funding + " dollars in funding, but have since ceased operations. Which other Techstars company would you like to know about?";
          return sentence;
      break;
      case "Acquired":
          var sentence = item.Name + " particpated in the Techstars " + item.Session + " program. They raised " + item.Funding + " dollars in funding, and were subsequently acquired. Which other Techstars company would you like to know about?";
          return sentence;
      break;
      default:
          var sentence = item.Name + " particpated in the Techstars " + item.Session + " program. They are based in " + item.City + " and have raised " + item.Funding + " dollars in funding. Which other Techstars company would you like to know about?";
          return sentence;
      break;
  }
}

//We have provided two ways to create your quiz questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item)
{
    switch(property)
    {
        case "Session":
            return "Here is your " + counter + "th question.  Which Techstars program did " + item.Name + " participate in?";
        break;
        case "Name":
            switch(item.Status)
            {
                case "Active":
                    return "Here is your " + counter + "th question. This company particpated in the Techstars " + item.Session + " program. They have raised " + item.Funding + " dollars in funding and are based in " + item.City;
                break;
                case "Acquired":
                    return "Here is your " + counter + "th question. This company particpated in the Techstars " + item.Session + " program. They raised " + item.Funding + " dollars in funding before they were acquired?";
                break;
                case "Failed":
                    return "Here is your " + counter + "th question. This company particpated in the Techstars " + item.Session + " program. They raised " + item.Funding + " dollars in funding before they shutdown.";
                break;
                default:
                    return "Here is your " + counter + "th question. This company particpated in the Techstars " + item.Session + " program. They have raised " + item.Funding + " dollars in funding and are based in " + item.City;
                break;
            }
        break;
        default:
            return "Here is your " + counter + "th question.  Which Techstars program did " + item.Name + " participate in?";
        break;
    }
}

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item)
{
    switch(property)
    {
        case "Session":
            return item.Name + " participated in the Techstars " + item.Session + " program. "
        break;
        case "Name":
            switch(item.Status)
            {
                case "Active":
                  return item.Name + " particpated in the Techstars " + item.Session + " program. They have raised " + item.Funding + " dollars in funding and are based in " + item.City + ". "
              break;
              case "Acquired":
                  return item.Name + " particpated in the Techstars " + item.Session + " program. They raised " + item.Funding + " dollars in funding before they were acquired. "
              break;
              case "Failed":
                  return item.Name + " particpated in the Techstars " + item.Session + " program. They raised " + item.Funding + " dollars in funding before they shutdown. "
              break;
              default:
                  return item.Name + " particpated in the Techstars " + item.Session + " program. They have raised " + item.Funding + " dollars in funding and are based in " + item.City + ". "
              break;
            }
        break;
        default:
            return item.Name + "participated in the Techstars " + item.Session + " program. "
        break;
    }
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Oh dear. Just kidding. Hurray", "Kaboom", "Kaching", "Oh snap", "Righto", "Way to go",
"Well done", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Eek", "Honk", "Oh boy", "Oh dear",
"Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

//This is the welcome message for when a user starts the skill without a specific intent.
var WELCOME_MESSAGE = "Welcome to the Techstars Trivia Skill! You can ask me about a Techstars company, or you can ask me to start a quiz. What would you like to do?";

//This is the message a user will hear when they start a quiz.
var START_QUIZ_MESSAGE = "OK. I will ask you 10 questions about Techstars companies.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
var EXIT_SKILL_MESSAGE = "Thank you for playing Techstars Trivia! Let's play again soon!";

//This is the message a user will hear after they ask (and hear) about a specific data element.
var REPROMPT_SPEECH = "Which other Techstars company would you like to know about?";

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = "I know lots of things about Techstars. You can ask me about a particular Techstars company, and I'll tell you what I know. You can also test your knowledge by asking me to start a quiz. What would you like to do?";


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE; }

//This is the message a user will receive after each question of a quiz.  It reminds them of their current score.
function getCurrentScore(score, counter) { return "Your current score is " + score + " out of " + counter + ". "; }

//This is the message a user will receive after they complete a quiz.  It tells them their final score.
function getFinalScore(score, counter) { return "Your final score is " + score + " out of " + counter + ". "; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
var USE_CARDS_FLAG = false;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.Name;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/" + item.Abbreviation + "._TTH_.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/" + item.Abbreviation + "._TTH_.png"; }

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================
var data = [
                  { Name: "Appsembler",         Session: "Cloud 2012 Winter",   Funding: 110000,      Status: "Active",   City: "Boston" },
                  { Name: "Cloudability",       Session: "Cloud 2012 Winter",   Funding: 33920000,    Status: "Active",   City: "Portland" },
                  { Name: "Cloudsnap",          Session: "Cloud 2012 Winter",   Funding: 310000,      Status: "Failed",   City: "Reno" },
                  { Name: "Conductrics",        Session: "Cloud 2012 Winter",   Funding: 450000,      Status: "Active",   City: "Brooklyn" },
                  { Name: "Distil Networks",    Session: "Cloud 2012 Winter",   Funding: 53110000,    Status: "Active",   City: "Arlington" },
                  { Name: "Emergent One",       Session: "Cloud 2012 Winter",   Funding: 440000,      Status: "Failed",   City: "San Francisco" },
                  { Name: "Epic Playground",    Session: "Cloud 2012 Winter",   Funding: 930000,      Status: "Active",   City: "Dallas" },
                  { Name: "Flomio",             Session: "Cloud 2012 Winter",   Funding: 610000,      Status: "Active",   City: "Miami Beach" },
                  { Name: "Keen IO",            Session: "Cloud 2012 Winter",   Funding: 28790000,    Status: "Active",   City: "San Francisco" },
                  { Name: "Tempo IQ",           Session: "Cloud 2012 Winter",   Funding: 4080000,     Status: "Acquired", City: "Chicago" },
                  { Name: "Vidmaker",           Session: "Cloud 2012 Winter",	  Funding: 910000,	    Status:	"Acquired",	City: "Madison" },
                  { Name: "Conspire",           Session: "Cloud 2013 Winter",   Funding: 3530000,	    Status:	"Acquired",	City: "Boulder" },
                  { Name: "DataRobot",          Session: "Cloud 2013 Winter",	  Funding: 111030000,	  Status:	"Active",	  City: "Boston" },
                  { Name: "Good Co",            Session: "Cloud 2013 Winter",	  Funding: 2340000,	    Status:	"Acquired",	City: "San Francisco" },
                  { Name: "Ionic",              Session: "Cloud 2013 Winter",	  Funding: 12700000,	  Status:	"Active",	  City: "Madison" },
                  { Name: "LiteStack",          Session: "Cloud 2013 Winter",	  Funding: 1530000,	    Status:	"Acquired",	City: "San Antonio" },
                  { Name: "ParLevel Systems",   Session: "Cloud 2013 Winter",	  Funding: 5580000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "Postmaster",         Session: "Cloud 2013 Winter",	  Funding: 910000,	    Status:	"Failed",	  City: "Austin" },
                  { Name: "Storytime Studios",  Session: "Cloud 2013 Winter",	  Funding: 1000000,	    Status:	"Active",	  City: "Boston" },
                  { Name: "Strategic Blue",     Session: "Cloud 2013 Winter",	  Funding: 10000,	      Status:	"Active",	  City: "London" },
                  { Name: "Threat Stack",       Session: "Cloud 2013 Winter",	  Funding: 27360000,	  Status:	"Active",	  City: "Alexandria" },
                  { Name: "TrueAbility",        Session: "Cloud 2013 Winter",	  Funding: 4550000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "Ziptask",            Session: "Cloud 2013 Winter",	  Funding: 110000,	    Status:	"Failed",	  City: "Anaheim" },
                  { Name: "Appbase",            Session: "Cloud 2015 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Astoria" },
                  { Name: "Bitfusion",          Session: "Cloud 2015 Winter",	  Funding: 5750000,	    Status:	"Active",	  City: "Austin" },
                  { Name: "Card Isle",          Session: "Cloud 2015 Winter",	  Funding: 640000,	    Status:	"Active",	  City: "Blacksburg" },
                  { Name: "Elasticode",         Session: "Cloud 2015 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Tel Aviv" },
                  { Name: "Fantasmo",           Session: "Cloud 2015 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Philidelphia" },
                  { Name: "Knowtify",           Session: "Cloud 2015 Winter",	  Funding: 110000,	    Status:	"Acquired",	City: "San Francisco" },
                  { Name: "Nebulab",            Session: "Cloud 2015 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "Stabilitas",         Session: "Cloud 2015 Winter",	  Funding: 440000,	    Status:	"Active",	  City: "Seattle" },
                  { Name: "Tenfold",            Session: "Cloud 2015 Winter",	  Funding: 17160000,	  Status:	"Active",	  City: "Austin" },
                  { Name: "Virtkick",           Session: "Cloud 2015 Winter",	  Funding: 990000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "Clyp",               Session: "Cloud 2016 Winter",	  Funding: 210000,	    Status:	"Active",	  City: "Austin" },
                  { Name: "Haste",              Session: "Cloud 2016 Winter",	  Funding: 3470000,	    Status:	"Active",	  City: "Atlanta" },
                  { Name: "Help Social",         Session: "Cloud 2016 Winter", 	Funding: 2400000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "HuBoard",            Session: "Cloud 2016 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Austin" },
                  { Name: "ilos Videos",        Session: "Cloud 2016 Winter",	  Funding: 1540000,	    Status:	"Active",	  City: "St. Paul" },
                  { Name: "Jumble",             Session: "Cloud 2016 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Dublin" },
                  { Name: "Pomika",             Session: "Cloud 2016 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "Popily",             Session: "Cloud 2016 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Austin" },
                  { Name: "Sage Hero",          Session: "Cloud 2016 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "San Antonio" },
                  { Name: "Switchboard",        Session: "Cloud 2016 Winter",	  Funding: 410000,	    Status:	"Active",	  City: "Orlando" },
                  { Name: "UX Testing",          Session: "Cloud 2016 Winter",	  Funding: 110000,	    Status:	"Active",	  City: "Taipei" },
                  { Name: "Bark",               Session: "Atlanta 2016 Summer", Funding: 1220000,     Status: "Active",   City: "Richmond Hill" },
                  { Name: "Drizzle", Session: "Atlanta 2016 Summer", Funding: 120000, Status: "Active", City: "Pasadena" },
                  { Name: "Fitspot", Session: "Atlanta 2016 Summer", Funding: 120000, Status: "Active", City: "Los Angeles" },
                  { Name: "Joonko", Session: "Atlanta 2016 Summer", Funding: 270000, Status: "Active", City: "Tel Aviv" },
                  { Name: "LaaSer", Session: "Atlanta 2016 Summer", Funding: 520000, Status: "Active", City: "Atlanta" },
                  { Name: "Preesale", Session: "Atlanta 2016 Summer", Funding: 120000, Status: "Active", City: "Brussels" },
                  { Name: "Real Meal Delivery", Session: "Atlanta 2016 Summer", Funding: 120000, Status: "Active", City: "Atlanta" },
                  { Name: "Sequr", Session: "Atlanta 2016 Summer", Funding: 2190000, Status: "Active", City: "Atlanta" },
                  { Name: "Splitty", Session: "Atlanta 2016 Summer", Funding: 1520000, Status: "Active", City: "Yokneam Ilit" },
                  { Name: "UCIC", Session: "Atlanta 2016 Summer", Funding: 480000, Status: "Active", City: "Kitchener" },
                  { Name: "Accountable", Session: "Austin 2013 Fall", Funding: 110000, Status: "Active", City: "Fort Worth" },
                  { Name: "Atlas Wristband", Session: "Austin 2013 Fall", Funding: 2920000, Status: "Active", City: "Austin" },
                  { Name: "Embrace", Session: "Austin 2013 Fall", Funding: 110000, Status: "Failed", City: "Austin" },
                  { Name: "Fosbury", Session: "Austin 2013 Fall", Funding: 300000, Status: "Acquired", City: "Austin" },
                  { Name: "Gone", Session: "Austin 2013 Fall", Funding: 1830000, Status: "Active", City: "San Francisco" },
                  { Name: "Market Vibe", Session: "Austin 2013 Fall", Funding: 110000, Status: "Acquired", City: "Austin" },
                  { Name: "Patient IO", Session: "Austin 2013 Fall", Funding: 2520000, Status: "Acquired", City: "Austin" },
                  { Name: "Plum", Session: "Austin 2013 Fall", Funding: 4870000, Status: "Active", City: "Austin" },
                  { Name: "ProtoExchange", Session: "Austin 2013 Fall", Funding: 110000, Status: "Failed", City: "Austin" },
                  { Name: "Testlio", Session: "Austin 2013 Fall", Funding: 7290000, Status: "Active", City: "San Francisco" },
                  { Name: "Bold Metrics", Session: "Austin 2014 Summer", Funding: 2620000, Status: "Active", City: "Austin" },
                  { Name: "Brewbot", Session: "Austin 2014 Summer", Funding: 2610000, Status: "Active", City: "Belfast" },
                  { Name: "Burpy", Session: "Austin 2014 Summer", Funding: 190000, Status: "Active", City: "Austin" },
                  { Name: "Cloud 66", Session: "Austin 2014 Summer", Funding: 2010000, Status: "Active", City: "London" },
                  { Name: "Common Form", Session: "Austin 2014 Summer", Funding: 110000, Status: "Failed", City: "San Diego" },
                  { Name: "Convey", Session: "Austin 2014 Summer", Funding: 7040000, Status: "Active", City: "Austin" },
                  { Name: "Experiment Engine", Session: "Austin 2014 Summer", Funding: 1160000, Status: "Acquired", City: "Austin" },
                  { Name: "Free Textbooks", Session: "Austin 2014 Summer", Funding: 10000, Status: "Active", City: "Birmingham" },
                  { Name: "Lawn Starter", Session: "Austin 2014 Summer", Funding: 7210000, Status: "Active", City: "Austin" },
                  { Name: "NMRKT", Session: "Austin 2014 Summer", Funding: 590000, Status: "Active", City: "Austin" },
                  { Name: "Smart Host", Session: "Austin 2014 Summer", Funding: 540000, Status: "Failed", City: "New York" },
                  { Name: "Fantasy Hub", Session: "Austin 2015 Spring", Funding: 280000, Status: "Failed", City: "Louisville" },
                  { Name: "Metric Story", Session: "Austin 2015 Spring", Funding: 1380000, Status: "Active", City: "Seattle" },
                  { Name: "One Model", Session: "Austin 2015 Spring", Funding: 1310000, Status: "Active", City: "Austin" },
                  { Name: "Pushmote", Session: "Austin 2015 Spring", Funding: 210000, Status: "Active", City: "Austin" },
                  { Name: "Red Fox Insights", Session: "Austin 2015 Spring", Funding: 610000, Status: "Active", City: "Austin" },
                  { Name: "Self Lender", Session: "Austin 2015 Spring", Funding: 2040000, Status: "Active", City: "Austin" },
                  { Name: "Stop Light", Session: "Austin 2015 Spring", Funding: 1310000, Status: "Active", City: "Venice" },
                  { Name: "Style Sage", Session: "Austin 2015 Spring", Funding: 3200000, Status: "Active", City: "New York" },
                  { Name: "The Great Out", Session: "Austin 2015 Spring", Funding: 860000, Status: "Active", City: "Austin" },
                  { Name: "Wonders Lab", Session: "Austin 2015 Spring", Funding: 110000, Status: "Failed", City: "Brooklyn" },
                  { Name: "AUTHORS", Session: "Austin 2016 Spring", Funding: 610000, Status: "Active", City: "Austin" },
                  { Name: "Bamba", Session: "Austin 2016 Spring", Funding: 1980000, Status: "Active", City: "Toronto" },
                  { Name: "Car Serv", Session: "Austin 2016 Spring", Funding: 120000, Status: "Active", City: "Austin" },
                  { Name: "Chowbotics", Session: "Austin 2016 Spring", Funding: 6250000, Status: "Active", City: "San Jose" },
                  { Name: "Kandidly", Session: "Austin 2016 Spring", Funding: 520000, Status: "Active", City: "Austin" },
                  { Name: "Pen Pal Schools", Session: "Austin 2016 Spring", Funding: 1320000, Status: "Active", City: "Austin" },
                  { Name: "Permit Zone", Session: "Austin 2016 Spring", Funding: 120000, Status: "Active", City: "Myrtle Beach" },
                  { Name: "PopUp Play", Session: "Austin 2016 Spring", Funding: 120000, Status: "Active", City: "Austin" },
                  { Name: "Remidi", Session: "Austin 2016 Spring", Funding: 120000, Status: "Active", City: "Austin" },
                  { Name: "The Helper Bees", Session: "Austin 2016 Spring", Funding: 620000, Status: "Active", City: "Austin" },
                  { Name: "Babbler", Session: "Austin 2017 Q1", Funding: 20000, Status: "Active", City: "Paris" },
                  { Name: "City Cop", Session: "Austin 2017 Q1", Funding: 120000, Status: "Active", City: "Austin" },
                  { Name: "Hey Super", Session: "Austin 2017 Q1", Funding: 220000, Status: "Active", City: "Austin" },
                  { Name: "Invomatic", Session: "Austin 2017 Q1", Funding: 120000, Status: "Active", City: "Bogot�" },
                  { Name: "NUKERN", Session: "Austin 2017 Q1", Funding: 120000, Status: "Active", City: "Montreal" },
                  { Name: "Prospectify", Session: "Austin 2017 Q1", Funding: 990000, Status: "Active", City: "Scottsdale" },
                  { Name: "Scale Factor", Session: "Austin 2017 Q1", Funding: 1120000, Status: "Active", City: "Austin" },
                  { Name: "The Wed Clique", Session: "Austin 2017 Q1", Funding: 120000, Status: "Active", City: "Charlotte" },
                  { Name: "Threatcare", Session: "Austin 2017 Q1", Funding: 1040000, Status: "Active", City: "Austin" },
                  { Name: "Writer Duet", Session: "Austin 2017 Q1", Funding: 20000, Status: "Active", City: "Austin" },
                  { Name: "Aire", Session: "Barclays 2014", Funding: 3390000, Status: "Active", City: "London" },
                  { Name: "Clause Match", Session: "Barclays 2014", Funding: 1150000, Status: "Active", City: "London" },
                  { Name: "Crowdestates", Session: "Barclays 2014", Funding: 20000, Status: "Failed", City: "London" },
                  { Name: "dopay", Session: "Barclays 2014", Funding: 4560000, Status: "Active", City: "London" },
                  { Name: "Glimr", Session: "Barclays 2014", Funding: 570000, Status: "Active", City: "London" },
                  { Name: "GUST", Session: "Barclays 2014", Funding: 100000, Status: "Failed", City: "Whitechapel" },
                  { Name: "Market IQ", Session: "Barclays 2014", Funding: 1020000, Status: "Active", City: "New York" },
                  { Name: "Novi Cap", Session: "Barclays 2014", Funding: 1820000, Status: "Active", City: "London" },
                  { Name: "Squirrel", Session: "Barclays 2014", Funding: 1420000, Status: "Active", City: "London" },
                  { Name: "Tryum", Session: "Barclays 2014", Funding: 200000, Status: "Failed", City: "London" },
                  { Name: "Vieweet", Session: "Barclays 2014", Funding: 430000, Status: "Active", City: "London" },
                  { Name: "Atlas", Session: "Barclays 2015 Spring", Funding: 2110000, Status: "Active", City: "New York" },
                  { Name: "Base Stone", Session: "Barclays 2015 Spring", Funding: 1640000, Status: "Active", City: "Cambridge" },
                  { Name: "Cutover", Session: "Barclays 2015 Spring", Funding: 2650000, Status: "Active", City: "London" },
                  { Name: "Everledger", Session: "Barclays 2015 Spring", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Liquid Landscape", Session: "Barclays 2015 Spring", Funding: 250000, Status: "Active", City: "San Francisco" },
                  { Name: "Origin", Session: "Barclays 2015 Spring", Funding: 1890000, Status: "Active", City: "London" },
                  { Name: "Post Quantum", Session: "Barclays 2015 Spring", Funding: 9310000, Status: "Active", City: "London" },
                  { Name: "Ravelin", Session: "Barclays 2015 Spring", Funding: 5820000, Status: "Active", City: "London" },
                  { Name: "Safello", Session: "Barclays 2015 Spring", Funding: 1260000, Status: "Active", City: "Stockholm" },
                  { Name: "Stockfuse", Session: "Barclays 2015 Spring", Funding: 120000, Status: "Active", City: "Brooklyn" },
                  { Name: "Agent Cash", Session: "Barclays 2016 Winter", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Cuvva", Session: "Barclays 2016 Winter", Funding: 1790000, Status: "Active", City: "London" },
                  { Name: "Digiseq Limited", Session: "Barclays 2016 Winter", Funding: 20000, Status: "Active", City: "Ikenham" },
                  { Name: "Forwardlane", Session: "Barclays 2016 Winter", Funding: 590000, Status: "Active", City: "New York" },
                  { Name: "Helm Solutions", Session: "Barclays 2016 Winter", Funding: 20000, Status: "Active", City: "New York" },
                  { Name: "MARK Labs", Session: "Barclays 2016 Winter", Funding: 120000, Status: "Active", City: "Washington" },
                  { Name: "Seldon", Session: "Barclays 2016 Winter", Funding: 70000, Status: "Active", City: "London" },
                  { Name: "Tallysticks", Session: "Barclays 2016 Winter", Funding: 940000, Status: "Active", City: "London" },
                  { Name: "Wala", Session: "Barclays 2016 Winter", Funding: 580000, Status: "Active", City: "Chicago" },
                  { Name: "Zighra", Session: "Barclays 2016 Winter", Funding: 1760000, Status: "Active", City: "Ottawa" },
                  { Name: "Alyne", Session: "Barclays 2017 Q1", Funding: 20000, Status: "Active", City: "Munich" },
                  { Name: "Barac", Session: "Barclays 2017 Q1", Funding: 0, Status: "Active", City: "London" },
                  { Name: "Bean", Session: "Barclays 2017 Q1", Funding: 500000, Status: "Active", City: "London" },
                  { Name: "Bokio", Session: "Barclays 2017 Q1", Funding: 20000, Status: "Active", City: "Gothenburg" },
                  { Name: "Citizen", Session: "Barclays 2017 Q1", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Courtsdesk", Session: "Barclays 2017 Q1", Funding: 120000, Status: "Active", City: "Dublin" },
                  { Name: "Flux", Session: "Barclays 2017 Q1", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Homeppl", Session: "Barclays 2017 Q1", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Shield Pay", Session: "Barclays 2017 Q1", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Simudyne", Session: "Barclays 2017 Q1", Funding: 20000, Status: "Active", City: "London" },
                  { Name: "Asoriba", Session: "Barclays Cape Town 2016 Spring", Funding: 20000, Status: "Active", City: "East Legon" },
                  { Name: "BenBen", Session: "Barclays Cape Town 2016 Spring", Funding: 20000, Status: "Active", City: "Accra" },
                  { Name: "Beyonic", Session: "Barclays Cape Town 2016 Spring", Funding: 670000, Status: "Active", City: "Washington" },
                  { Name: "Inuka Pap", Session: "Barclays Cape Town 2016 Spring", Funding: 160000, Status: "Active", City: "Nairobi" },
                  { Name: "Jamii", Session: "Barclays Cape Town 2016 Spring", Funding: 520000, Status: "Active", City: "Dar es Salaam" },
                  { Name: "ReAble", Session: "Barclays Cape Town 2016 Spring", Funding: 20000, Status: "Active", City: "Beyrouth" },
                  { Name: "Simba Pay", Session: "Barclays Cape Town 2016 Spring", Funding: 20000, Status: "Active", City: "London" },
                  { Name: "Social Lender", Session: "Barclays Cape Town 2016 Spring", Funding: 20000, Status: "Active", City: "Onikan" },
                  { Name: "tech 4 farmers", Session: "Barclays Cape Town 2016 Spring", Funding: 120000, Status: "Active", City: "Kampala" },
                  { Name: "WizzPass", Session: "Barclays Cape Town 2016 Spring", Funding: 20000, Status: "Active", City: "Johannesburg" },
                  { Name: "Alloy", Session: "Barclays NYC 2015 Summer", Funding: 1560000, Status: "Active", City: "Brooklyn" },
                  { Name: "Cashforce", Session: "Barclays NYC 2015 Summer", Funding: 1100000, Status: "Active", City: "New York" },
                  { Name: "Chainalysis", Session: "Barclays NYC 2015 Summer", Funding: 1520000, Status: "Active", City: "New York" },
                  { Name: "Liveoak Technologies", Session: "Barclays NYC 2015 Summer", Funding: 2850000, Status: "Active", City: "Austin" },
                  { Name: "Logrr", Session: "Barclays NYC 2015 Summer", Funding: 960000, Status: "Active", City: "Boulder" },
                  { Name: "Range Force", Session: "Barclays NYC 2015 Summer", Funding: 120000, Status: "Active", City: "Tallinn" },
                  { Name: "Remesh", Session: "Barclays NYC 2015 Summer", Funding: 1640000, Status: "Active", City: "Cleveland" },
                  { Name: "Seeds", Session: "Barclays NYC 2015 Summer", Funding: 410000, Status: "Active", City: "New York" },
                  { Name: "Syndicated Loan Direct", Session: "Barclays NYC 2015 Summer", Funding: 570000, Status: "Active", City: "New York" },
                  { Name: "WAVE", Session: "Barclays NYC 2015 Summer", Funding: 1760000, Status: "Active", City: "Kfar Saba" },
                  { Name: "Wayerz", Session: "Barclays NYC 2015 Summer", Funding: 2920000, Status: "Active", City: "New York" },
                  { Name: "Acute IQ", Session: "Barclays NYC 2016 Summer", Funding: 300000, Status: "Active", City: "San Francisco" },
                  { Name: "Alpha Exchange", Session: "Barclays NYC 2016 Summer", Funding: 20000, Status: "Active", City: "London" },
                  { Name: "Chroma", Session: "Barclays NYC 2016 Summer", Funding: 460000, Status: "Active", City: "Portland" },
                  { Name: "Create", Session: "Barclays NYC 2016 Summer", Funding: 3480000, Status: "Active", City: "Washington" },
                  { Name: "Ernit", Session: "Barclays NYC 2016 Summer", Funding: 790000, Status: "Active", City: "Copenhagen" },
                  { Name: "Morty", Session: "Barclays NYC 2016 Summer", Funding: 2730000, Status: "Active", City: "New York" },
                  { Name: "Painless 1099", Session: "Barclays NYC 2016 Summer", Funding: 210000, Status: "Active", City: "Buffalo" },
                  { Name: "Pierce Matrix", Session: "Barclays NYC 2016 Summer", Funding: 2010000, Status: "Active", City: "New York" },
                  { Name: "Stack Source", Session: "Barclays NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Windrush", Session: "Barclays NYC 2016 Summer", Funding: 350000, Status: "Active", City: "Saratoga Springs" },
                  { Name: "B2B Pay", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Berlin" },
                  { Name: "B stow", Session: "Barclays Tel Aviv 2016", Funding: 370000, Status: "Active", City: "Brooklyn" },
                  { Name: "Civilize", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Modiin" },
                  { Name: "Corrbi", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Herzliva" },
                  { Name: "Cyber DriveWare", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Herzliya" },
                  { Name: "Financial Juice", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Samurai", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Slide Piper", Session: "Barclays Tel Aviv 2016", Funding: 120000, Status: "Active", City: "Kochav Yair" },
                  { Name: "Vala", Session: "Barclays Tel Aviv 2016", Funding: 420000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Wisor", Session: "Barclays Tel Aviv 2016", Funding: 460000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Akdemia", Session: "Berlin 2015 Summer", Funding: 110000, Status: "Active", City: "Lima" },
                  { Name: "App Insight", Session: "Berlin 2015 Summer", Funding: 2510000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Avemus", Session: "Berlin 2015 Summer", Funding: 110000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Datapath IO", Session: "Berlin 2015 Summer", Funding: 1190000, Status: "Active", City: "Mainz" },
                  { Name: "Eversport", Session: "Berlin 2015 Summer", Funding: 910000, Status: "Active", City: "Vienna" },
                  { Name: "Jib Jib", Session: "Berlin 2015 Summer", Funding: 110000, Status: "Active", City: "London" },
                  { Name: "Nudge Health", Session: "Berlin 2015 Summer", Funding: 270000, Status: "Active", City: "Berlin" },
                  { Name: "Preply", Session: "Berlin 2015 Summer", Funding: 1480000, Status: "Active", City: "Brighton" },
                  { Name: "Stagelink", Session: "Berlin 2015 Summer", Funding: 780000, Status: "Active", City: "Berlin" },
                  { Name: "treev", Session: "Berlin 2015 Summer", Funding: 110000, Status: "Active", City: "Berlin" },
                  { Name: "ANYA", Session: "Berlin 2016 Summer", Funding: 150000, Status: "Active", City: "San Francisco" },
                  { Name: "Contellio", Session: "Berlin 2016 Summer", Funding: 870000, Status: "Active", City: "Krakow" },
                  { Name: "Funeria", Session: "Berlin 2016 Summer", Funding: 120000, Status: "Active", City: "Berlin" },
                  { Name: "Goedle IO", Session: "Berlin 2016 Summer", Funding: 100000, Status: "Active", City: "Cologne" },
                  { Name: "Kisura", Session: "Berlin 2016 Summer", Funding: 2350000, Status: "Active", City: "Berlin" },
                  { Name: "lengoo", Session: "Berlin 2016 Summer", Funding: 1250000, Status: "Active", City: "Berlin" },
                  { Name: "Mimo", Session: "Berlin 2016 Summer", Funding: 110000, Status: "Active", City: "Vienna" },
                  { Name: "Mobiag", Session: "Berlin 2016 Summer", Funding: 20000, Status: "Active", City: "Lisbon" },
                  { Name: "Palleter", Session: "Berlin 2016 Summer", Funding: 120000, Status: "Active", City: "Tallinn" },
                  { Name: "Raklet", Session: "Berlin 2016 Summer", Funding: 120000, Status: "Active", City: "San Francisco" },
                  { Name: "App Samurai", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "San Francisco" },
                  { Name: "atript", Session: "Berlin 2017 Q1", Funding: 210000, Status: "Active", City: "Berlin" },
                  { Name: "Cucumber Tony", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "London" },
                  { Name: "ICM Hub", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "New York" },
                  { Name: "Quotiss", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "Warsaw" },
                  { Name: "Trevor", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "Milton Keynes" },
                  { Name: "Van Hack", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "Vancouver" },
                  { Name: "Vaultoro", Session: "Berlin 2017 Q1", Funding: 110000, Status: "Active", City: "Berlin" },
                  { Name: "Accel Golf", Session: "Boston 2009 Spring", Funding: 390000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Amp Idea", Session: "Boston 2009 Spring", Funding: 10000, Status: "Failed", City: "Boston" },
                  { Name: "Baydin", Session: "Boston 2009 Spring", Funding: 410000, Status: "Active", City: "Mountain View" },
                  { Name: "Have My Shift", Session: "Boston 2009 Spring", Funding: 10000, Status: "Failed", City: "Chicago" },
                  { Name: "Lango Lab", Session: "Boston 2009 Spring", Funding: 10000, Status: "Failed", City: "Cambridge" },
                  { Name: "Localytics", Session: "Boston 2009 Spring", Funding: 58110000, Status: "Active", City: "Cambridge" },
                  { Name: "One forty", Session: "Boston 2009 Spring", Funding: 1980000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Sensobi", Session: "Boston 2009 Spring", Funding: 10000, Status: "Acquired", City: "New York" },
                  { Name: "Temp Mine", Session: "Boston 2009 Spring", Funding: 10000, Status: "Failed", City: "Boston" },
                  { Name: "Crowdly", Session: "Boston 2010 Spring", Funding: 2970000, Status: "Active", City: "Boston" },
                  { Name: "Loudcaster", Session: "Boston 2010 Spring", Funding: 10000, Status: "Failed", City: "Somerville" },
                  { Name: "Mogotest", Session: "Boston 2010 Spring", Funding: 10000, Status: "Failed", City: "Cambridge" },
                  { Name: "Monkey Analytics", Session: "Boston 2010 Spring", Funding: 10000, Status: "Failed", City: "Scituate" },
                  { Name: "Nextly", Session: "Boston 2010 Spring", Funding: 2350000, Status: "Failed", City: "Cambridge" },
                  { Name: "Progress Innovation", Session: "Boston 2010 Spring", Funding: 10000, Status: "Failed", City: "" },
                  { Name: "Social Sci", Session: "Boston 2010 Spring", Funding: 1010000, Status: "Failed", City: "Cambridge" },
                  { Name: "Spark Cloud", Session: "Boston 2010 Spring", Funding: 0, Status: "Failed", City: "Cambridge" },
                  { Name: "Star Street", Session: "Boston 2010 Spring", Funding: 6340000, Status: "Active", City: "Cambridge" },
                  { Name: "Tutorial Tab", Session: "Boston 2010 Spring", Funding: 10000, Status: "Failed", City: "" },
                  { Name: "Ever True", Session: "Boston 2011 Spring", Funding: 11500000, Status: "Active", City: "Cambridge" },
                  { Name: "Ginger IO", Session: "Boston 2011 Spring", Funding: 28200000, Status: "Active", City: "San Francisco" },
                  { Name: "Grab CAD", Session: "Boston 2011 Spring", Funding: 13420000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Help Scout", Session: "Boston 2011 Spring", Funding: 13030000, Status: "Active", City: "Boston" },
                  { Name: "Kinvey", Session: "Boston 2011 Spring", Funding: 18030000, Status: "Active", City: "Cambridge" },
                  { Name: "Memrise", Session: "Boston 2011 Spring", Funding: 5210000, Status: "Active", City: "London" },
                  { Name: "Placester", Session: "Boston 2011 Spring", Funding: 98380000, Status: "Active", City: "Boston" },
                  { Name: "Promoboxx", Session: "Boston 2011 Spring", Funding: 10460000, Status: "Active", City: "Boston" },
                  { Name: "Senexx", Session: "Boston 2011 Spring", Funding: 260000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Spill", Session: "Boston 2011 Spring", Funding: 1030000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Strohl Medical Technologies", Session: "Boston 2011 Spring", Funding: 1100000, Status: "Active", City: "Boston" },
                  { Name: "The Tap Lab", Session: "Boston 2011 Spring", Funding: 2180000, Status: "Active", City: "Cambridge" },
                  { Name: "Careport Health", Session: "Boston 2012 Fall", Funding: 3750000, Status: "Acquired", City: "Boston" },
                  { Name: "Cart Crunch", Session: "Boston 2012 Fall", Funding: 1070000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Coach Up", Session: "Boston 2012 Fall", Funding: 13120000, Status: "Active", City: "Boston" },
                  { Name: "Dash bell", Session: "Boston 2012 Fall", Funding: 920000, Status: "Failed", City: "Cambridge" },
                  { Name: "Databox", Session: "Boston 2012 Fall", Funding: 3690000, Status: "Active", City: "Boston" },
                  { Name: "Fashion Project", Session: "Boston 2012 Fall", Funding: 11320000, Status: "Failed", City: "Boston" },
                  { Name: "Fetch notes", Session: "Boston 2012 Fall", Funding: 880000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Impulse Save", Session: "Boston 2012 Fall", Funding: 110000, Status: "Acquired", City: "Cambridge" },
                  { Name: "My Better Fit", Session: "Boston 2012 Fall", Funding: 420000, Status: "Failed", City: "Cambridge" },
                  { Name: "NBD Nano", Session: "Boston 2012 Fall", Funding: 3900000, Status: "Active", City: "Boston" },
                  { Name: "Ovia Health", Session: "Boston 2012 Fall", Funding: 15650000, Status: "Active", City: "Boston" },
                  { Name: "Rise Robotics", Session: "Boston 2012 Fall", Funding: 2820000, Status: "Active", City: "Boston" },
                  { Name: "Wymsee", Session: "Boston 2012 Fall", Funding: 5060000, Status: "Active", City: "San Mateo" },
                  { Name: "Bison", Session: "Boston 2012 Spring", Funding: 5880000, Status: "Active", City: "Boston" },
                  { Name: "Doc Trackr", Session: "Boston 2012 Spring", Funding: 1340000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Instafreebie", Session: "Boston 2012 Spring", Funding: 1960000, Status: "Active", City: "Boston" },
                  { Name: "Laveem", Session: "Boston 2012 Spring", Funding: 110000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Mortar Data", Session: "Boston 2012 Spring", Funding: 2760000, Status: "Acquired", City: "New York" },
                  { Name: "Murfie", Session: "Boston 2012 Spring", Funding: 4440000, Status: "Active", City: "Madison" },
                  { Name: "Pact", Session: "Boston 2012 Spring", Funding: 2360000, Status: "Active", City: "Boston" },
                  { Name: "Psykosoft", Session: "Boston 2012 Spring", Funding: 830000, Status: "Failed", City: "Tours" },
                  { Name: "Shopsy", Session: "Boston 2012 Spring", Funding: 110000, Status: "Failed", City: "Yorktown Heights" },
                  { Name: "Simply Good", Session: "Boston 2012 Spring", Funding: 1010000, Status: "Active", City: "Cambridge" },
                  { Name: "Testive", Session: "Boston 2012 Spring", Funding: 4670000, Status: "Active", City: "Boston" },
                  { Name: "Uber Sense", Session: "Boston 2012 Spring", Funding: 2460000, Status: "Acquired", City: "Boston" },
                  { Name: "Zagster", Session: "Boston 2012 Spring", Funding: 17850000, Status: "Active", City: "Philadelphia" },
                  { Name: "Check IO", Session: "Boston 2013 Spring", Funding: 760000, Status: "Active", City: "Dnepropetrovsk" },
                  { Name: "Codeship", Session: "Boston 2013 Spring", Funding: 11300000, Status: "Active", City: "Boston" },
                  { Name: "Continuum Fashion", Session: "Boston 2013 Spring", Funding: 110000, Status: "Active", City: "Cambridge" },
                  { Name: "co Urbanize", Session: "Boston 2013 Spring", Funding: 2010000, Status: "Active", City: "Somerville" },
                  { Name: "Fancred", Session: "Boston 2013 Spring", Funding: 4680000, Status: "Active", City: "Boston" },
                  { Name: "Five", Session: "Boston 2013 Spring", Funding: 2460000, Status: "Active", City: "Cambridge" },
                  { Name: "Freight Farms", Session: "Boston 2013 Spring", Funding: 11560000, Status: "Active", City: "Boston" },
                  { Name: "Jebbit", Session: "Boston 2013 Spring", Funding: 3500000, Status: "Active", City: "Chestnut Hill" },
                  { Name: "Link Cycle", Session: "Boston 2013 Spring", Funding: 110000, Status: "Failed", City: "Cambridge" },
                  { Name: "Neurala", Session: "Boston 2013 Spring", Funding: 15780000, Status: "Active", City: "Boston" },
                  { Name: "Pill Pack", Session: "Boston 2013 Spring", Funding: 95240000, Status: "Active", City: "Cambridge" },
                  { Name: "Qunb", Session: "Boston 2013 Spring", Funding: 10000, Status: "Failed", City: "Paris" },
                  { Name: "Rallyware", Session: "Boston 2013 Spring", Funding: 2380000, Status: "Active", City: "San Francisco" },
                  { Name: "Synack", Session: "Boston 2013 Spring", Funding: 55450000, Status: "Active", City: "Redwood City" },
                  { Name: "Affectly", Session: "Boston 2014 Fall", Funding: 2000000, Status: "Active", City: "Boston" },
                  { Name: "Codeanywhere", Session: "Boston 2014 Fall", Funding: 800000, Status: "Active", City: "San Francisco" },
                  { Name: "Cool Chip Technologies", Session: "Boston 2014 Fall", Funding: 5580000, Status: "Active", City: "Somerville" },
                  { Name: "Fair waves", Session: "Boston 2014 Fall", Funding: 510000, Status: "Active", City: "Somerville" },
                  { Name: "Fortified Bicycle", Session: "Boston 2014 Fall", Funding: 2320000, Status: "Active", City: "Boston" },
                  { Name: "Hello Block", Session: "Boston 2014 Fall", Funding: 110000, Status: "Active", City: "Boston" },
                  { Name: "indico", Session: "Boston 2014 Fall", Funding: 4380000, Status: "Active", City: "Boston" },
                  { Name: "Magnet by Headtalk", Session: "Boston 2014 Fall", Funding: 110000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Mavrck", Session: "Boston 2014 Fall", Funding: 8030000, Status: "Active", City: "Boston" },
                  { Name: "ROCKI", Session: "Boston 2014 Fall", Funding: 400000, Status: "Active", City: "Boston" },
                  { Name: "Spitfire Athlete", Session: "Boston 2014 Fall", Funding: 110000, Status: "Active", City: "San Francisco" },
                  { Name: "Streamroot", Session: "Boston 2014 Fall", Funding: 1910000, Status: "Active", City: "New York" },
                  { Name: "Ten Percent Happier", Session: "Boston 2014 Winter", Funding: 4380000, Status: "Active", City: "Boston" },
                  { Name: "Amino", Session: "Boston 2014 Winter", Funding: 27600000, Status: "Active", City: "Medford" },
                  { Name: "Bevi", Session: "Boston 2014 Winter", Funding: 8240000, Status: "Active", City: "Boston" },
                  { Name: "Cangrade", Session: "Boston 2014 Winter", Funding: 430000, Status: "Active", City: "Cambridge" },
                  { Name: "ecoVent", Session: "Boston 2014 Winter", Funding: 9740000, Status: "Active", City: "Cambridge" },
                  { Name: "Hermes IQ", Session: "Boston 2014 Winter", Funding: 110000, Status: "Active", City: "Braintree" },
                  { Name: "Litographs", Session: "Boston 2014 Winter", Funding: 600000, Status: "Active", City: "Cambridge" },
                  { Name: "Mapkin", Session: "Boston 2014 Winter", Funding: 1560000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Onion Corporation", Session: "Boston 2014 Winter", Funding: 490000, Status: "Active", City: "Toronto" },
                  { Name: "Sundar", Session: "Boston 2014 Winter", Funding: 1610000, Status: "Active", City: "New York" },
                  { Name: "WOO", Session: "Boston 2014 Winter", Funding: 6130000, Status: "Active", City: "Boston" },
                  { Name: "Work Mob", Session: "Boston 2014 Winter", Funding: 110000, Status: "Failed", City: "San Francisco" },
                  { Name: "Admit Hub", Session: "Boston 2015 Summer", Funding: 3540000, Status: "Active", City: "Arlington" },
                  { Name: "Cart Fresh", Session: "Boston 2015 Summer", Funding: 1910000, Status: "Active", City: "Boston" },
                  { Name: "Cuseum", Session: "Boston 2015 Summer", Funding: 1390000, Status: "Active", City: "Boston" },
                  { Name: "doDOC", Session: "Boston 2015 Summer", Funding: 110000, Status: "Active", City: "Boston" },
                  { Name: "Hot", Session: "Boston 2015 Summer", Funding: 10000, Status: "Active", City: "Marbella" },
                  { Name: "Kwambio", Session: "Boston 2015 Summer", Funding: 780000, Status: "Active", City: "Boston" },
                  { Name: "lovepop", Session: "Boston 2015 Summer", Funding: 7260000, Status: "Active", City: "Cambridge" },
                  { Name: "Netra", Session: "Boston 2015 Summer", Funding: 2200000, Status: "Active", City: "Boston" },
                  { Name: "Provender", Session: "Boston 2015 Summer", Funding: 110000, Status: "Active", City: "Montreal" },
                  { Name: "Shearwater International", Session: "Boston 2015 Summer", Funding: 1110000, Status: "Active", City: "Boston" },
                  { Name: "Smack High", Session: "Boston 2015 Summer", Funding: 3880000, Status: "Active", City: "Boston" },
                  { Name: "Thrive Hive", Session: "Boston 2015 Summer", Funding: 5360000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Air Fox", Session: "Boston 2016 Spring", Funding: 1160000, Status: "Active", City: "Boston" },
                  { Name: "Daily Pnut", Session: "Boston 2016 Spring", Funding: 120000, Status: "Acquired", City: "Cambridge" },
                  { Name: "Danger Awesome", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Cambridge" },
                  { Name: "Grapevine", Session: "Boston 2016 Spring", Funding: 820000, Status: "Active", City: "Cambridge" },
                  { Name: "Heddoko", Session: "Boston 2016 Spring", Funding: 980000, Status: "Active", City: "Boston" },
                  { Name: "Navut", Session: "Boston 2016 Spring", Funding: 1580000, Status: "Active", City: "Montreal" },
                  { Name: "Polis", Session: "Boston 2016 Spring", Funding: 1220000, Status: "Active", City: "Boston" },
                  { Name: "Rocketbook", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Seed and Spark", Session: "Boston 2016 Spring", Funding: 1370000, Status: "Active", City: "Los Angeles" },
                  { Name: "Spoiler Alert", Session: "Boston 2016 Spring", Funding: 2550000, Status: "Active", City: "Boston" },
                  { Name: "Strobe", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Tapglue", Session: "Boston 2016 Spring", Funding: 440000, Status: "Acquired", City: "Boston" },
                  { Name: "Taylor and Hart", Session: "Boston 2016 Spring", Funding: 190000, Status: "Active", City: "London" },
                  { Name: "Yaypay", Session: "Boston 2016 Spring", Funding: 660000, Status: "Active", City: "Boston" },
                  { Name: "Alices Table", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Brain Spec", Session: "Boston 2016 Spring", Funding: 140000, Status: "Active", City: "Boston" },
                  { Name: "Brizi", Session: "Boston 2016 Spring", Funding: 20000, Status: "Active", City: "Boston" },
                  { Name: "Care Academy", Session: "Boston 2016 Spring", Funding: 390000, Status: "Active", City: "Cambridge" },
                  { Name: "Evolve", Session: "Boston 2016 Spring", Funding: 1070000, Status: "Active", City: "Boston" },
                  { Name: "Lorem Technologies", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Nix", Session: "Boston 2016 Spring", Funding: 430000, Status: "Active", City: "Boston" },
                  { Name: "Off Grid Box", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Rate Gravity", Session: "Boston 2016 Spring", Funding: 2050000, Status: "Active", City: "Boston" },
                  { Name: "Sea Machines Robotics", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Solstice", Session: "Boston 2016 Spring", Funding: 560000, Status: "Active", City: "Boston" },
                  { Name: "Tive", Session: "Boston 2016 Spring", Funding: 340000, Status: "Active", City: "Boston" },
                  { Name: "Voatz", Session: "Boston 2016 Spring", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Bright kite", Session: "Boulder 2007 Summer", Funding: 1090000, Status: "Acquired", City: "Burlingame" },
                  { Name: "Event Vue", Session: "Boulder 2007 Summer", Funding: 450000, Status: "Failed", City: "Boulder" },
                  { Name: "Filtrbox", Session: "Boulder 2007 Summer", Funding: 1320000, Status: "Acquired", City: "Palo Alto" },
                  { Name: "Intense Debate", Session: "Boulder 2007 Summer", Funding: 510000, Status: "Acquired", City: "Boulder" },
                  { Name: "KB Labs", Session: "Boulder 2007 Summer", Funding: 10000, Status: "Failed", City: "" },
                  { Name: "Mad Kast", Session: "Boulder 2007 Summer", Funding: 310000, Status: "Acquired", City: "Boulder" },
                  { Name: "Play Q", Session: "Boulder 2007 Summer", Funding: 10000, Status: "Active", City: "Philadelphia" },
                  { Name: "Search to Phone", Session: "Boulder 2007 Summer", Funding: 260000, Status: "Failed", City: "Boulder" },
                  { Name: "Social thing", Session: "Boulder 2007 Summer", Funding: 480000, Status: "Failed", City: "Boulder" },
                  { Name: "Which Ventures", Session: "Boulder 2007 Summer", Funding: 10000, Status: "Failed", City: "New York" },
                  { Name: "altvia", Session: "Boulder 2008 Summer", Funding: 10000, Status: "Active", City: "Broomfield" },
                  { Name: "Buy Play Win", Session: "Boulder 2008 Summer", Funding: 10000, Status: "Failed", City: "Boulder" },
                  { Name: "DailyBurn", Session: "Boulder 2008 Summer", Funding: 510000, Status: "Acquired", City: "New York" },
                  { Name: "Devver", Session: "Boulder 2008 Summer", Funding: 510000, Status: "Failed", City: "Boulder" },
                  { Name: "Foodzie", Session: "Boulder 2008 Summer", Funding: 1010000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Occipital", Session: "Boulder 2008 Summer", Funding: 22010000, Status: "Active", City: "Boulder" },
                  { Name: "Peoples Software Company", Session: "Boulder 2008 Summer", Funding: 10000, Status: "Failed", City: "New York" },
                  { Name: "StepOut", Session: "Boulder 2008 Summer", Funding: 6420000, Status: "Acquired", City: "New York" },
                  { Name: "The Highway Girl", Session: "Boulder 2008 Summer", Funding: 10000, Status: "Failed", City: "Atlanta" },
                  { Name: "Using Miles", Session: "Boulder 2008 Summer", Funding: 3260000, Status: "Acquired", City: "Denver" },
                  { Name: "Graphicly", Session: "Boulder 2009 Summer", Funding: 6660000, Status: "Acquired", City: "Palo Alto" },
                  { Name: "Mailana", Session: "Boulder 2009 Summer", Funding: 0, Status: "Failed", City: "" },
                  { Name: "Next Big Sound", Session: "Boulder 2009 Summer", Funding: 7960000, Status: "Acquired", City: "New York" },
                  { Name: "ReTel Technologies", Session: "Boulder 2009 Summer", Funding: 1010000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Rezora", Session: "Boulder 2009 Summer", Funding: 10000, Status: "Active", City: "Boulder" },
                  { Name: "Send Grid", Session: "Boulder 2009 Summer", Funding: 81010000, Status: "Active", City: "Boulder" },
                  { Name: "Snap Engage", Session: "Boulder 2009 Summer", Funding: 10000, Status: "Acquired", City: "Boulder" },
                  { Name: "Spry", Session: "Boulder 2009 Summer", Funding: 10000, Status: "Failed", City: "" },
                  { Name: "Travel Blogs", Session: "Boulder 2009 Summer", Funding: 790000, Status: "Acquired", City: "Boulder" },
                  { Name: "Vanilla Forums", Session: "Boulder 2009 Summer", Funding: 1010000, Status: "Active", City: "Montreal" },
                  { Name: "Ad struc", Session: "Boulder 2010 Summer", Funding: 4610000, Status: "Active", City: "New York" },
                  { Name: "Captimo", Session: "Boulder 2010 Summer", Funding: 3360000, Status: "Acquired", City: "Boulder" },
                  { Name: "Invited Home", Session: "Boulder 2010 Summer", Funding: 4510000, Status: "Active", City: "Boulder" },
                  { Name: "Kapost", Session: "Boulder 2010 Summer", Funding: 18990000, Status: "Active", City: "Boulder" },
                  { Name: "Lumatic", Session: "Boulder 2010 Summer", Funding: 810000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Rent Monitor", Session: "Boulder 2010 Summer", Funding: 10000, Status: "Failed", City: "Des Moines" },
                  { Name: "Round Pegg", Session: "Boulder 2010 Summer", Funding: 5370000, Status: "Active", City: "Boulder" },
                  { Name: "Script Pad", Session: "Boulder 2010 Summer", Funding: 610000, Status: "Failed", City: "Boulder" },
                  { Name: "Sphero", Session: "Boulder 2010 Summer", Funding: 133150000, Status: "Active", City: "Boulder" },
                  { Name: "Spot Right", Session: "Boulder 2010 Summer", Funding: 10650000, Status: "Acquired", City: "Boulder" },
                  { Name: "Stats Mix", Session: "Boulder 2010 Summer", Funding: 10000, Status: "Acquired", City: "Boulder" },
                  { Name: "Creative Brain Studios", Session: "Boulder 2011 Summer", Funding: 10000, Status: "Failed", City: "Boulder" },
                  { Name: "Flextrip", Session: "Boulder 2011 Summer", Funding: 360000, Status: "Acquired", City: "Boulder" },
                  { Name: "Full Contact", Session: "Boulder 2011 Summer", Funding: 46160000, Status: "Active", City: "Denver" },
                  { Name: "Go Spot Check", Session: "Boulder 2011 Summer", Funding: 24860000, Status: "Active", City: "Denver" },
                  { Name: "Inbox Fever", Session: "Boulder 2011 Summer", Funding: 10000, Status: "Failed", City: "" },
                  { Name: "Meal Ticket", Session: "Boulder 2011 Summer", Funding: 3650000, Status: "Active", City: "Boise" },
                  { Name: "Mocavo", Session: "Boulder 2011 Summer", Funding: 6210000, Status: "Acquired", City: "Boulder" },
                  { Name: "Precog", Session: "Boulder 2011 Summer", Funding: 3560000, Status: "Acquired", City: "Boulder" },
                  { Name: "Rapt Media", Session: "Boulder 2011 Summer", Funding: 8450000, Status: "Active", City: "Boulder" },
                  { Name: "Simple Energy", Session: "Boulder 2011 Summer", Funding: 11000000, Status: "Active", City: "Boulder" },
                  { Name: "Social Engine", Session: "Boulder 2011 Summer", Funding: 10000, Status: "Acquired", City: "Los Angeles" },
                  { Name: "Truant Today", Session: "Boulder 2011 Summer", Funding: 10000, Status: "Failed", City: "Los Angeles" },
                  { Name: "Bird Box", Session: "Boulder 2012 Summer", Funding: 980000, Status: "Failed", City: "Boulder" },
                  { Name: "Deal Angel", Session: "Boulder 2012 Summer", Funding: 860000, Status: "Acquired", City: "Los Angeles" },
                  { Name: "Digital Ocean", Session: "Boulder 2012 Summer", Funding: 119850000, Status: "Active", City: "New York" },
                  { Name: "Pivot Desk", Session: "Boulder 2012 Summer", Funding: 10210000, Status: "Acquired", City: "Boulder" },
                  { Name: "Reply Send", Session: "Boulder 2012 Summer", Funding: 110000, Status: "Failed", City: "Boulder" },
                  { Name: "Revolv", Session: "Boulder 2012 Summer", Funding: 7370000, Status: "Acquired", City: "Boulder" },
                  { Name: "Roll Sale", Session: "Boulder 2012 Summer", Funding: 110000, Status: "Failed", City: "Saint Louis" },
                  { Name: "Roximity", Session: "Boulder 2012 Summer", Funding: 2260000, Status: "Acquired", City: "Denver" },
                  { Name: "Sales Loft", Session: "Boulder 2012 Summer", Funding: 25770000, Status: "Active", City: "Atlanta" },
                  { Name: "Sewingly", Session: "Boulder 2012 Summer", Funding: 110000, Status: "Failed", City: "Boulder" },
                  { Name: "Smart Toy", Session: "Boulder 2012 Summer", Funding: 2240000, Status: "Acquired", City: "Boulder" },
                  { Name: "Verbalize It", Session: "Boulder 2012 Summer", Funding: 2340000, Status: "Acquired", City: "New York" },
                  { Name: "Ads Native", Session: "Boulder 2013 Summer", Funding: 13210000, Status: "Active", City: "San Francisco" },
                  { Name: "Augur", Session: "Boulder 2013 Summer", Funding: 1910000, Status: "Acquired", City: "Denver" },
                  { Name: "Brandfolder", Session: "Boulder 2013 Summer", Funding: 3110000, Status: "Active", City: "Denver" },
                  { Name: "Brite Hub", Session: "Boulder 2013 Summer", Funding: 1380000, Status: "Active", City: "Oakland" },
                  { Name: "Given Goods Company", Session: "Boulder 2013 Summer", Funding: 470000, Status: "Failed", City: "Boulder" },
                  { Name: "Good April", Session: "Boulder 2013 Summer", Funding: 110000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Hull", Session: "Boulder 2013 Summer", Funding: 2620000, Status: "Active", City: "Atlanta" },
                  { Name: "Prediculous", Session: "Boulder 2013 Summer", Funding: 110000, Status: "Acquired", City: "Boulder" },
                  { Name: "Same room", Session: "Boulder 2013 Summer", Funding: 3860000, Status: "Acquired", City: "Oakland" },
                  { Name: "Shopventory", Session: "Boulder 2013 Summer", Funding: 1760000, Status: "Active", City: "Englewood" },
                  { Name: "Snow Shoe", Session: "Boulder 2013 Summer", Funding: 3430000, Status: "Active", City: "San Francisco" },
                  { Name: "Bawte", Session: "Boulder 2014 Summer", Funding: 210000, Status: "Failed", City: "Des Moines" },
                  { Name: "Expense Bot", Session: "Boulder 2014 Summer", Funding: 2080000, Status: "Active", City: "Cleveland" },
                  { Name: "Final", Session: "Boulder 2014 Summer", Funding: 3830000, Status: "Active", City: "Mountain View" },
                  { Name: "Kapta", Session: "Boulder 2014 Summer", Funding: 1210000, Status: "Active", City: "Boulder" },
                  { Name: "Lassy Project", Session: "Boulder 2014 Summer", Funding: 330000, Status: "Failed", City: "Longmont" },
                  { Name: "Notion", Session: "Boulder 2014 Summer", Funding: 5450000, Status: "Active", City: "Denver" },
                  { Name: "OUTRO", Session: "Boulder 2014 Summer", Funding: 1190000, Status: "Active", City: "Salt Lake City" },
                  { Name: "Pana", Session: "Boulder 2014 Summer", Funding: 2240000, Status: "Active", City: "Denver" },
                  { Name: "Shareable Social", Session: "Boulder 2014 Summer", Funding: 110000, Status: "Active", City: "Denver" },
                  { Name: "Sportsy", Session: "Boulder 2014 Summer", Funding: 510000, Status: "Active", City: "Playa Vista" },
                  { Name: "Wellhire", Session: "Boulder 2014 Summer", Funding: 210000, Status: "Failed", City: "Boulder" },
                  { Name: "Work Bright", Session: "Boulder 2014 Summer", Funding: 1700000, Status: "Active", City: "Boulder" },
                  { Name: "Wunder", Session: "Boulder 2014 Summer", Funding: 4730000, Status: "Active", City: "Boulder" },
                  { Name: "Ad Hawk", Session: "Boulder 2015 Summer", Funding: 2120000, Status: "Active", City: "New York" },
                  { Name: "Blazing DB", Session: "Boulder 2015 Summer", Funding: 1610000, Status: "Active", City: "Houston" },
                  { Name: "Edify", Session: "Boulder 2015 Summer", Funding: 1100000, Status: "Active", City: "Boulder" },
                  { Name: "flyte desk", Session: "Boulder 2015 Summer", Funding: 2110000, Status: "Active", City: "Boulder" },
                  { Name: "hobby DB", Session: "Boulder 2015 Summer", Funding: 390000, Status: "Active", City: "Boulder" },
                  { Name: "Mad Kudu", Session: "Boulder 2015 Summer", Funding: 1370000, Status: "Active", City: "Mountain View" },
                  { Name: "Revolar", Session: "Boulder 2015 Summer", Funding: 4940000, Status: "Active", City: "Denver" },
                  { Name: "Stryd", Session: "Boulder 2015 Summer", Funding: 1070000, Status: "Active", City: "Boulder" },
                  { Name: "TRELORA", Session: "Boulder 2015 Summer", Funding: 3840000, Status: "Active", City: "Denver" },
                  { Name: "bridge21", Session: "Boulder 2016 Spring", Funding: 240000, Status: "Active", City: "Denver" },
                  { Name: "Converge", Session: "Boulder 2016 Spring", Funding: 920000, Status: "Active", City: "San Francisco" },
                  { Name: "edn", Session: "Boulder 2016 Spring", Funding: 620000, Status: "Active", City: "Denver" },
                  { Name: "Init AI", Session: "Boulder 2016 Spring", Funding: 620000, Status: "Active", City: "New York" },
                  { Name: "Maxwell Financial", Session: "Boulder 2016 Spring", Funding: 1950000, Status: "Active", City: "Denver" },
                  { Name: "Meet Mindful", Session: "Boulder 2016 Spring", Funding: 2960000, Status: "Active", City: "Denver" },
                  { Name: "Orderly Health", Session: "Boulder 2016 Spring", Funding: 220000, Status: "Active", City: "Denver" },
                  { Name: "section IO", Session: "Boulder 2016 Spring", Funding: 2240000, Status: "Active", City: "Boulder" },
                  { Name: "Sigmend", Session: "Boulder 2016 Spring", Funding: 180000, Status: "Active", City: "Denver" },
                  { Name: "Spoken", Session: "Boulder 2016 Spring", Funding: 120000, Status: "Active", City: "Chattanooga" },
                  { Name: "Trace", Session: "Boulder 2016 Spring", Funding: 910000, Status: "Active", City: "Provo" },
                  { Name: "Apostrophe", Session: "Boulder 2017 Q1", Funding: 120000, Status: "Active", City: "Denver" },
                  { Name: "Attentive", Session: "Boulder 2017 Q1", Funding: 250000, Status: "Active", City: "Braga" },
                  { Name: "Blank Slate Systems", Session: "Boulder 2017 Q1", Funding: 120000, Status: "Active", City: "Boulder" },
                  { Name: "CANDL", Session: "Boulder 2017 Q1", Funding: 110000, Status: "Active", City: "Atlanta" },
                  { Name: "Data Nerds", Session: "Boulder 2017 Q1", Funding: 20000, Status: "Active", City: "Kelowna" },
                  { Name: "Global EIR", Session: "Boulder 2017 Q1", Funding: 0, Status: "Active", City: "Boulder" },
                  { Name: "Hardbound", Session: "Boulder 2017 Q1", Funding: 420000, Status: "Active", City: "New York" },
                  { Name: "Iron Core Labs", Session: "Boulder 2017 Q1", Funding: 710000, Status: "Active", City: "Boulder" },
                  { Name: "Monday", Session: "Boulder 2017 Q1", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Prefix", Session: "Boulder 2017 Q1", Funding: 510000, Status: "Active", City: "Austin" },
                  { Name: "Rodin", Session: "Boulder 2017 Q1", Funding: 220000, Status: "Active", City: "Los Angeles" },
                  { Name: "Sitter", Session: "Boulder 2017 Q1", Funding: 630000, Status: "Active", City: "Boulder" },
                  { Name: "Stateless", Session: "Boulder 2017 Q1", Funding: 170000, Status: "Active", City: "Boulder" },
                  { Name: "Capture Proof", Session: "Chicago 2013 Spring", Funding: 3040000, Status: "Active", City: "San Francisco" },
                  { Name: "Findit", Session: "Chicago 2013 Spring", Funding: 670000, Status: "Failed", City: "Sunnyvale" },
                  { Name: "Nexercise", Session: "Chicago 2013 Spring", Funding: 4700000, Status: "Active", City: "Kensington" },
                  { Name: "Pathful", Session: "Chicago 2013 Spring", Funding: 400000, Status: "Acquired", City: "Vancouver" },
                  { Name: "Project Fixup", Session: "Chicago 2013 Spring", Funding: 110000, Status: "Failed", City: "Chicago" },
                  { Name: "Simple Relevance", Session: "Chicago 2013 Spring", Funding: 1600000, Status: "Acquired", City: "Chicago" },
                  { Name: "Social Crunch", Session: "Chicago 2013 Spring", Funding: 680000, Status: "Acquired", City: "Chicago" },
                  { Name: "Sqord", Session: "Chicago 2013 Spring", Funding: 4120000, Status: "Active", City: "Durham" },
                  { Name: "Trading View", Session: "Chicago 2013 Spring", Funding: 3660000, Status: "Active", City: "Chicago" },
                  { Name: "Web Curfew", Session: "Chicago 2013 Spring", Funding: 460000, Status: "Active", City: "Richmond Hill" },
                  { Name: "Clutch Prep", Session: "Chicago 2014 Spring", Funding: 260000, Status: "Active", City: "Miami" },
                  { Name: "Data Everywhere", Session: "Chicago 2014 Spring", Funding: 110000, Status: "Active", City: "Chicago" },
                  { Name: "Game Wisp", Session: "Chicago 2014 Spring", Funding: 2130000, Status: "Active", City: "Nashville" },
                  { Name: "inRentive", Session: "Chicago 2014 Spring", Funding: 510000, Status: "Active", City: "Chicago" },
                  { Name: "Mart Mobi Technologies", Session: "Chicago 2014 Spring", Funding: 110000, Status: "Acquired", City: "Chicago" },
                  { Name: "NexLP", Session: "Chicago 2014 Spring", Funding: 2110000, Status: "Active", City: "Chicago" },
                  { Name: "Package Zen", Session: "Chicago 2014 Spring", Funding: 110000, Status: "Active", City: "Chicago" },
                  { Name: "Tangiblee", Session: "Chicago 2014 Spring", Funding: 830000, Status: "Active", City: "Chicago" },
                  { Name: "Telnyx", Session: "Chicago 2014 Spring", Funding: 10000, Status: "Active", City: "Chicago" },
                  { Name: "We Deliver", Session: "Chicago 2014 Spring", Funding: 1560000, Status: "Acquired", City: "Chicago" },
                  { Name: "Akouba Credit", Session: "Chicago 2015 Summer", Funding: 110000, Status: "Active", City: "Chicago" },
                  { Name: "Betaout", Session: "Chicago 2015 Summer", Funding: 1510000, Status: "Active", City: "Palo Alto" },
                  { Name: "Glidera", Session: "Chicago 2015 Summer", Funding: 110000, Status: "Acquired", City: "Chicago" },
                  { Name: "Growth Geeks", Session: "Chicago 2015 Summer", Funding: 1420000, Status: "Active", City: "Chicago" },
                  { Name: "Hooks", Session: "Chicago 2015 Summer", Funding: 730000, Status: "Active", City: "Chicago" },
                  { Name: "Lightstream", Session: "Chicago 2015 Summer", Funding: 1830000, Status: "Active", City: "Chicago" },
                  { Name: "Routific", Session: "Chicago 2015 Summer", Funding: 1310000, Status: "Active", City: "Vancouver" },
                  { Name: "Specless", Session: "Chicago 2015 Summer", Funding: 110000, Status: "Active", City: "Chicago" },
                  { Name: "Tribe", Session: "Chicago 2015 Summer", Funding: 360000, Status: "Active", City: "Chicago" },
                  { Name: "Urban Leash", Session: "Chicago 2015 Summer", Funding: 160000, Status: "Active", City: "Chicago" },
                  { Name: "Arena", Session: "Chicago 2016 Summer", Funding: 120000, Status: "Active", City: "San Francisco" },
                  { Name: "Bright", Session: "Chicago 2016 Summer", Funding: 120000, Status: "Active", City: "Chicago" },
                  { Name: "Brightwork", Session: "Chicago 2016 Summer", Funding: 120000, Status: "Active", City: "Portland" },
                  { Name: "Complete Set", Session: "Chicago 2016 Summer", Funding: 1240000, Status: "Active", City: "Cincinnati" },
                  { Name: "Convert Flow", Session: "Chicago 2016 Summer", Funding: 120000, Status: "Active", City: "Miami" },
                  { Name: "Eat Pakd", Session: "Chicago 2016 Summer", Funding: 3280000, Status: "Active", City: "Chicago" },
                  { Name: "Fitbot", Session: "Chicago 2016 Summer", Funding: 120000, Status: "Active", City: "Boulder" },
                  { Name: "Jio", Session: "Chicago 2016 Summer", Funding: 4240000, Status: "Active", City: "Chicago" },
                  { Name: "LogicGate", Session: "Chicago 2016 Summer", Funding: 2620000, Status: "Active", City: "Chicago" },
                  { Name: "PartySlate", Session: "Chicago 2016 Summer", Funding: 2660000, Status: "Active", City: "Chicago" },
                  { Name: "Afineur", Session: "Connection 2016 Winter", Funding: 20000, Status: "Active", City: "Brooklyn" },
                  { Name: "Analytical Flavor Systems", Session: "Connection 2016 Winter", Funding: 220000, Status: "Active", City: "State College" },
                  { Name: "Drinkeasy", Session: "Connection 2016 Winter", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Intelligent Layer", Session: "Connection 2016 Winter", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "NaCa Fermentation", Session: "Connection 2016 Winter", Funding: 120000, Status: "Active", City: "Portland" },
                  { Name: "Octi", Session: "Connection 2016 Winter", Funding: 120000, Status: "Active", City: "" },
                  { Name: "Paranoid Fan", Session: "Connection 2016 Winter", Funding: 1720000, Status: "Active", City: "Dallas" },
                  { Name: "Party with a Local", Session: "Connection 2016 Winter", Funding: 120000, Status: "Active", City: "Amsterdam" },
                  { Name: "PlanSnap", Session: "Connection 2016 Winter", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Quantac", Session: "Connection 2016 Winter", Funding: 160000, Status: "Active", City: "Boston" },
                  { Name: "Codarica", Session: "Disney 2014", Funding: 120000, Status: "Acquired", City: "Stockholm" },
                  { Name: "FamilyTech", Session: "Disney 2014", Funding: 7180000, Status: "Active", City: "Cincinnati" },
                  { Name: "Jogg", Session: "Disney 2014", Funding: 120000, Status: "Active", City: "Los Angeles" },
                  { Name: "Sidelines", Session: "Disney 2014", Funding: 380000, Status: "Active", City: "San Francisco" },
                  { Name: "Smart Toy", Session: "Disney 2014", Funding: 2240000, Status: "Acquired", City: "Boulder" },
                  { Name: "Snow Shoe", Session: "Disney 2014", Funding: 3430000, Status: "Active", City: "San Francisco" },
                  { Name: "Sphero", Session: "Disney 2014", Funding: 133150000, Status: "Active", City: "Boulder" },
                  { Name: "Twigtale", Session: "Disney 2014", Funding: 1100000, Status: "Active", City: "Marina Del Rey" },
                  { Name: "Tyffon", Session: "Disney 2014", Funding: 1120000, Status: "Active", City: "Los Angeles" },
                  { Name: "We Buy Gold", Session: "Disney 2014", Funding: 4270000, Status: "Active", City: "Los Angeles" },
                  { Name: "Decisive", Session: "Disney 2015", Funding: 910000, Status: "Failed", City: "New York" },
                  { Name: "EMOTIV", Session: "Disney 2015", Funding: 20000, Status: "Active", City: "San Francisco" },
                  { Name: "FEM", Session: "Disney 2015", Funding: 3070000, Status: "Active", City: "San Francisco" },
                  { Name: "HYP3R", Session: "Disney 2015", Funding: 4510000, Status: "Active", City: "Los Angeles" },
                  { Name: "Imperson", Session: "Disney 2015", Funding: 2010000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Littlstar", Session: "Disney 2015", Funding: 5890000, Status: "Active", City: "New York" },
                  { Name: "Makie Lab", Session: "Disney 2015", Funding: 20000, Status: "Acquired", City: "London" },
                  { Name: "Open Bionics", Session: "Disney 2015", Funding: 450000, Status: "Active", City: "Bristol" },
                  { Name: "Pundit", Session: "Disney 2015", Funding: 320000, Status: "Active", City: "Los Angeles" },
                  { Name: "Stat Muse", Session: "Disney 2015", Funding: 11850000, Status: "Active", City: "San Francisco" },
                  { Name: "Applied VR", Session: "Healthcare 2016 Spring", Funding: 20000, Status: "Active", City: "Los Angeles" },
                  { Name: "Deep Six Analytics", Session: "Healthcare 2016 Spring", Funding: 2020000, Status: "Active", City: "Pasadena" },
                  { Name: "Ella", Session: "Healthcare 2016 Spring", Funding: 260000, Status: "Active", City: "Los Angeles" },
                  { Name: "Grace", Session: "Healthcare 2016 Spring", Funding: 790000, Status: "Active", City: "Los Angeles" },
                  { Name: "Home Hero", Session: "Healthcare 2016 Spring", Funding: 23250000, Status: "Active", City: "Santa Monica" },
                  { Name: "Inscope Medical Solutions", Session: "Healthcare 2016 Spring", Funding: 1340000, Status: "Active", City: "Louisville" },
                  { Name: "Silver sheet", Session: "Healthcare 2016 Spring", Funding: 2980000, Status: "Active", City: "Culver City" },
                  { Name: "Stasis Labs", Session: "Healthcare 2016 Spring", Funding: 4930000, Status: "Active", City: "Los Angeles" },
                  { Name: "Well Health", Session: "Healthcare 2016 Spring", Funding: 2720000, Status: "Active", City: "San Francisco" },
                  { Name: "Yosko", Session: "Healthcare 2016 Spring", Funding: 290000, Status: "Active", City: "Los Angeles" },
                  { Name: "Zendy Health", Session: "Healthcare 2016 Spring", Funding: 2670000, Status: "Active", City: "Los Angeles" },
                  { Name: "Cerebro Solutions", Session: "Healthcare 2017 Q1", Funding: 20000, Status: "Active", City: "Los Angeles" },
                  { Name: "Enso Relief", Session: "Healthcare 2017 Q1", Funding: 0, Status: "Active", City: "" },
                  { Name: "Frame Health", Session: "Healthcare 2017 Q1", Funding: 120000, Status: "Active", City: "Los Angeles" },
                  { Name: "Healthcare TTU", Session: "Healthcare 2017 Q1", Funding: 20000, Status: "Active", City: "Franklin" },
                  { Name: "Health Tensor", Session: "Healthcare 2017 Q1", Funding: 120000, Status: "Active", City: "Los Angeles" },
                  { Name: "Noteworth", Session: "Healthcare 2017 Q1", Funding: 20000, Status: "Active", City: "Hoboken" },
                  { Name: "Referral MD", Session: "Healthcare 2017 Q1", Funding: 480000, Status: "Active", City: "San Francisco" },
                  { Name: "Dronesmith Technologies", Session: "IoT 2016 Winter", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Fueloyal", Session: "IoT 2016 Winter", Funding: 320000, Status: "Active", City: "Chicago" },
                  { Name: "Galaxy AI", Session: "IoT 2016 Winter", Funding: 120000, Status: "Active", City: "" },
                  { Name: "Losant", Session: "IoT 2016 Winter", Funding: 1420000, Status: "Active", City: "Cincinnati" },
                  { Name: "Mosaic Manufacturing", Session: "IoT 2016 Winter", Funding: 20000, Status: "Active", City: "Toronto" },
                  { Name: "Pillar Technologies", Session: "IoT 2016 Winter", Funding: 810000, Status: "Active", City: "Boston" },
                  { Name: "TEQ", Session: "IoT 2016 Winter", Funding: 120000, Status: "Active", City: "Atlanta" },
                  { Name: "Union Crate", Session: "IoT 2016 Winter", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Urban 3D", Session: "IoT 2016 Winter", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Xapix", Session: "IoT 2016 Winter", Funding: 120000, Status: "Active", City: "Berlin" },
                  { Name: "Degreed", Session: "Kaplan 2013", Funding: 36900000, Status: "Active", City: "San Francisco" },
                  { Name: "Flinja", Session: "Kaplan 2013", Funding: 20000, Status: "Active", City: "San Francisco" },
                  { Name: "Mathify", Session: "Kaplan 2013", Funding: 20000, Status: "Active", City: "Pittsburgh" },
                  { Name: "Mentor Mob", Session: "Kaplan 2013", Funding: 20000, Status: "Active", City: "Chicago" },
                  { Name: "modern guild", Session: "Kaplan 2013", Funding: 1770000, Status: "Active", City: "New York" },
                  { Name: "Newsela", Session: "Kaplan 2013", Funding: 24620000, Status: "Active", City: "New York" },
                  { Name: "Pan Open", Session: "Kaplan 2013", Funding: 4450000, Status: "Active", City: "New York" },
                  { Name: "Ranku", Session: "Kaplan 2013", Funding: 1170000, Status: "Acquired", City: "New York" },
                  { Name: "Uvize", Session: "Kaplan 2013", Funding: 920000, Status: "Acquired", City: "Boulder" },
                  { Name: "Verificient Technologies", Session: "Kaplan 2013", Funding: 1820000, Status: "Active", City: "New York" },
                  { Name: "Branching Minds", Session: "Kaplan 2014", Funding: 170000, Status: "Active", City: "New York" },
                  { Name: "Class Wallet", Session: "Kaplan 2014", Funding: 7110000, Status: "Active", City: "Miami" },
                  { Name: "Cognotion", Session: "Kaplan 2014", Funding: 2370000, Status: "Active", City: "New York" },
                  { Name: "Creator Box", Session: "Kaplan 2014", Funding: 170000, Status: "Failed", City: "" },
                  { Name: "Edvisor IO", Session: "Kaplan 2014", Funding: 1220000, Status: "Active", City: "Vancouver" },
                  { Name: "Grockit", Session: "Kaplan 2014", Funding: 0, Status: "Active", City: "" },
                  { Name: "Learn", Session: "Kaplan 2014", Funding: 1170000, Status: "Active", City: "Raleigh" },
                  { Name: "reKode Education", Session: "Kaplan 2014", Funding: 170000, Status: "Active", City: "Redmond" },
                  { Name: "RobotsLAB", Session: "Kaplan 2014", Funding: 20000, Status: "Active", City: "San Francisco" },
                  { Name: "Smarton Learning Solutions", Session: "Kaplan 2014", Funding: 170000, Status: "Active", City: "New york" },
                  { Name: "Story2", Session: "Kaplan 2014", Funding: 170000, Status: "Active", City: "New York" },
                  { Name: "TuvaLabs", Session: "Kaplan 2014", Funding: 170000, Status: "Active", City: "Randolph" },
                  { Name: "Clarify", Session: "London 2013 Fall", Funding: 580000, Status: "Active", City: "London" },
                  { Name: "Modabound", Session: "London 2013 Fall", Funding: 110000, Status: "Failed", City: "New York City" },
                  { Name: "Moni", Session: "London 2013 Fall", Funding: 4430000, Status: "Failed", City: "London" },
                  { Name: "Open Voice", Session: "London 2013 Fall", Funding: 10000, Status: "Failed", City: "" },
                  { Name: "Osper", Session: "London 2013 Fall", Funding: 11140000, Status: "Active", City: "London" },
                  { Name: "Paymins", Session: "London 2013 Fall", Funding: 110000, Status: "Failed", City: "Dublin" },
                  { Name: "Peerby", Session: "London 2013 Fall", Funding: 3130000, Status: "Active", City: "Amsterdam" },
                  { Name: "Play Canvas", Session: "London 2013 Fall", Funding: 480000, Status: "Active", City: "London" },
                  { Name: "Quan Template", Session: "London 2013 Fall", Funding: 10850000, Status: "Active", City: "Gibraltar" },
                  { Name: "TV Beat", Session: "London 2013 Fall", Funding: 3360000, Status: "Active", City: "Palo Alto" },
                  { Name: "Vet Cloud", Session: "London 2013 Fall", Funding: 580000, Status: "Active", City: "Clerkenwell" },
                  { Name: "Avuba", Session: "London 2014 Spring", Funding: 890000, Status: "Failed", City: "Berlin" },
                  { Name: "e Rated", Session: "London 2014 Spring", Funding: 2450000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Good Audience", Session: "London 2014 Spring", Funding: 110000, Status: "Active", City: "London" },
                  { Name: "Lingvist", Session: "London 2014 Spring", Funding: 8720000, Status: "Active", City: "Tallinn" },
                  { Name: "Magnific", Session: "London 2014 Spring", Funding: 120000, Status: "Failed", City: "London" },
                  { Name: "Mainframe", Session: "London 2014 Spring", Funding: 8640000, Status: "Active", City: "San Francisco" },
                  { Name: "proximus", Session: "London 2014 Spring", Funding: 270000, Status: "Active", City: "London" },
                  { Name: "Pubble", Session: "London 2014 Spring", Funding: 120000, Status: "Active", City: "Cork" },
                  { Name: "Send Bird", Session: "London 2014 Spring", Funding: 4320000, Status: "Active", City: "Redwood City" },
                  { Name: "Short Cut", Session: "London 2014 Spring", Funding: 980000, Status: "Failed", City: "London" },
                  { Name: "Zzish", Session: "London 2014 Spring", Funding: 1450000, Status: "Active", City: "London" },
                  { Name: "Bidvine", Session: "London 2014 Winter", Funding: 4360000, Status: "Active", City: "London" },
                  { Name: "Big Data for Humans", Session: "London 2014 Winter", Funding: 3610000, Status: "Active", City: "Edinburgh" },
                  { Name: "Blink", Session: "London 2014 Winter", Funding: 3130000, Status: "Active", City: "London" },
                  { Name: "Geo Spock", Session: "London 2014 Winter", Funding: 6730000, Status: "Active", City: "Cambridge" },
                  { Name: "Indybo", Session: "London 2014 Winter", Funding: 10000, Status: "Active", City: "Cambridge" },
                  { Name: "Lystable", Session: "London 2014 Winter", Funding: 24170000, Status: "Active", City: "London" },
                  { Name: "Rainbird", Session: "London 2014 Winter", Funding: 950000, Status: "Active", City: "" },
                  { Name: "Swarm", Session: "London 2014 Winter", Funding: 10000, Status: "Active", City: "" },
                  { Name: "UB", Session: "London 2014 Winter", Funding: 1830000, Status: "Active", City: "London" },
                  { Name: "Unmade", Session: "London 2014 Winter", Funding: 4090000, Status: "Active", City: "London" },
                  { Name: "Ambie", Session: "London 2015 Fall", Funding: 480000, Status: "Active", City: "Golders Green" },
                  { Name: "Curious", Session: "London 2015 Fall", Funding: 50000, Status: "Active", City: "" },
                  { Name: "Deekit", Session: "London 2015 Fall", Funding: 510000, Status: "Active", City: "London" },
                  { Name: "Hackajob", Session: "London 2015 Fall", Funding: 540000, Status: "Active", City: "London" },
                  { Name: "Headliner", Session: "London 2015 Fall", Funding: 110000, Status: "Active", City: "London" },
                  { Name: "NomNom", Session: "London 2015 Fall", Funding: 2170000, Status: "Active", City: "London" },
                  { Name: "PrintToPeer", Session: "London 2015 Fall", Funding: 110000, Status: "Active", City: "Calgary" },
                  { Name: "Sam Heather Ltd", Session: "London 2015 Fall", Funding: 50000, Status: "Active", City: "Probus Truro" },
                  { Name: "Sorry as a Service", Session: "London 2015 Fall", Funding: 110000, Status: "Active", City: "London" },
                  { Name: "Spero", Session: "London 2015 Fall", Funding: 120000, Status: "Active", City: "Provo" },
                  { Name: "TeskaLabs", Session: "London 2015 Fall", Funding: 110000, Status: "Active", City: "London" },
                  { Name: "Weave AI", Session: "London 2015 Fall", Funding: 140000, Status: "Active", City: "" },
                  { Name: "Aid Tech", Session: "London 2016 Summer", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Asset Vault", Session: "London 2016 Summer", Funding: 120000, Status: "Active", City: "" },
                  { Name: "Avalon AI", Session: "London 2016 Summer", Funding: 130000, Status: "Active", City: "London" },
                  { Name: "DataSine", Session: "London 2016 Summer", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Didimo", Session: "London 2016 Summer", Funding: 500000, Status: "Active", City: "" },
                  { Name: "DrFocused", Session: "London 2016 Summer", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Madbarz", Session: "London 2016 Summer", Funding: 120000, Status: "Active", City: "" },
                  { Name: "Memgraph", Session: "London 2016 Summer", Funding: 2340000, Status: "Active", City: "London" },
                  { Name: "Mindi", Session: "London 2016 Summer", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "SwiftComply", Session: "London 2016 Summer", Funding: 1030000, Status: "Active", City: "Dublin" },
                  { Name: "Tenzo", Session: "London 2016 Summer", Funding: 800000, Status: "Active", City: "London" },
                  { Name: "Coffee Cloud", Session: "Metro 2015 Winter", Funding: 120000, Status: "Active", City: "Zagreb" },
                  { Name: "Flowtify", Session: "Metro 2015 Winter", Funding: 790000, Status: "Active", City: "Cologne" },
                  { Name: "Gastrozentrale", Session: "Metro 2015 Winter", Funding: 1120000, Status: "Active", City: "Munich" },
                  { Name: "GroupRaise", Session: "Metro 2015 Winter", Funding: 1170000, Status: "Active", City: "Houston" },
                  { Name: "Journy", Session: "Metro 2015 Winter", Funding: 610000, Status: "Active", City: "New York" },
                  { Name: "Lunchio", Session: "Metro 2015 Winter", Funding: 780000, Status: "Active", City: "Berlin" },
                  { Name: "Poshpacker", Session: "Metro 2015 Winter", Funding: 150000, Status: "Failed", City: "Washington" },
                  { Name: "ROOMATIC", Session: "Metro 2015 Winter", Funding: 110000, Status: "Active", City: "" },
                  { Name: "rublys GmbH", Session: "Metro 2015 Winter", Funding: 10000, Status: "Active", City: "Vienna" },
                  { Name: "Wynd", Session: "Metro 2015 Winter", Funding: 41500000, Status: "Active", City: "Paris" },
                  { Name: "zenchef", Session: "Metro 2015 Winter", Funding: 6790000, Status: "Active", City: "Paris" },
                  { Name: "Apparier", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Cheerfy", Session: "Metro 2016 Winter", Funding: 210000, Status: "Active", City: "London" },
                  { Name: "fragPaul", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "Cologne" },
                  { Name: "Hoard", Session: "Metro 2016 Winter", Funding: 650000, Status: "Active", City: "Berlin" },
                  { Name: "Hyre", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "Ottawa" },
                  { Name: "Jagger", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "Tel Aviv" },
                  { Name: "pantreeco", Session: "Metro 2016 Winter", Funding: 110000, Status: "Active", City: "Australia" },
                  { Name: "Reputize", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "London" },
                  { Name: "Smunch - Smart Lunch", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "Berlin" },
                  { Name: "tsenso", Session: "Metro 2016 Winter", Funding: 120000, Status: "Active", City: "Stuttgart" },
                  { Name: "Appetas", Session: "Microsoft Azure 2012", Funding: 120000, Status: "Acquired", City: "Seattle" },
                  { Name: "BagsUp", Session: "Microsoft Azure 2012", Funding: 20000, Status: "Active", City: "Redmond" },
                  { Name: "Email Copilot", Session: "Microsoft Azure 2012", Funding: 1260000, Status: "Acquired", City: "San Diego" },
                  { Name: "Keebitz", Session: "Microsoft Azure 2012", Funding: 0, Status: "Failed", City: "Seattle" },
                  { Name: "MetricsHub", Session: "Microsoft Azure 2012", Funding: 20000, Status: "Acquired", City: "Bellevue" },
                  { Name: "Prism", Session: "Microsoft Azure 2012", Funding: 1020000, Status: "Acquired", City: "Bellevue" },
                  { Name: "Realty Mogul", Session: "Microsoft Azure 2012", Funding: 45000000, Status: "Active", City: "Redmond" },
                  { Name: "Ripl", Session: "Microsoft Azure 2012", Funding: 3990000, Status: "Active", City: "Bellevue" },
                  { Name: "Socedo", Session: "Microsoft Azure 2012", Funding: 2490000, Status: "Active", City: "Seattle" },
                  { Name: "Staq", Session: "Microsoft Azure 2012", Funding: 20000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Airpost", Session: "Microsoft Azure 2013", Funding: 210000, Status: "Acquired", City: "San Francisco" },
                  { Name: "AppSheet", Session: "Microsoft Azure 2013", Funding: 2030000, Status: "Active", City: "Bellevue" },
                  { Name: "Azuqua", Session: "Microsoft Azure 2013", Funding: 5560000, Status: "Active", City: "Seattle" },
                  { Name: "Beehive ID", Session: "Microsoft Azure 2013", Funding: 70000, Status: "Failed", City: "Austin" },
                  { Name: "Boxella", Session: "Microsoft Azure 2013", Funding: 20000, Status: "Failed", City: "Seattle" },
                  { Name: "BuildersCloud", Session: "Microsoft Azure 2013", Funding: 1170000, Status: "Active", City: "Bellevue" },
                  { Name: "Factor IO", Session: "Microsoft Azure 2013", Funding: 160000, Status: "Active", City: "Portland" },
                  { Name: "Heroicly", Session: "Microsoft Azure 2013", Funding: 210000, Status: "Active", City: "Seattle" },
                  { Name: "OFunnel", Session: "Microsoft Azure 2013", Funding: 20000, Status: "Active", City: "Redmond" },
                  { Name: "Synch", Session: "Microsoft Azure 2013", Funding: 20000, Status: "Failed", City: "Seattle" },
                  { Name: "Atlas 5D", Session: "Microsoft Kinect 2012", Funding: 3690000, Status: "Active", City: "Cambridge" },
                  { Name: "Campfire", Session: "Microsoft Kinect 2012", Funding: 1260000, Status: "Active", City: "Seattle" },
                  { Name: "GestSure", Session: "Microsoft Kinect 2012", Funding: 1520000, Status: "Active", City: "Boston" },
                  { Name: "Ikkos", Session: "Microsoft Kinect 2012", Funding: 0, Status: "Active", City: "Seattle" },
                  { Name: "Jintronix", Session: "Microsoft Kinect 2012", Funding: 3160000, Status: "Active", City: "Montreal" },
                  { Name: "Kimetric", Session: "Microsoft Kinect 2012", Funding: 0, Status: "Active", City: "Miami" },
                  { Name: "ManCTL", Session: "Microsoft Kinect 2012", Funding: 20000, Status: "Acquired", City: "Boulder" },
                  { Name: "NConnex", Session: "Microsoft Kinect 2012", Funding: 20000, Status: "Failed", City: "San Francisco" },
                  { Name: "Styku", Session: "Microsoft Kinect 2012", Funding: 1910000, Status: "Active", City: "Los Angeles" },
                  { Name: "UBI Interactive", Session: "Microsoft Kinect 2012", Funding: 120000, Status: "Active", City: "Seattle" },
                  { Name: "Voxon", Session: "Microsoft Kinect 2012", Funding: 20000, Status: "Active", City: "New York" },
                  { Name: "CDL Warrior", Session: "Mobility 2015 Summer", Funding: 890000, Status: "Active", City: "Pittsburgh" },
                  { Name: "Classics and Exotics", Session: "Mobility 2015 Summer", Funding: 280000, Status: "Active", City: "Forestdale" },
                  { Name: "Elegus Technologies", Session: "Mobility 2015 Summer", Funding: 170000, Status: "Active", City: "Ann Arbor" },
                  { Name: "Lunar Labs", Session: "Mobility 2015 Summer", Funding: 3210000, Status: "Active", City: "Detroit" },
                  { Name: "Motoroso", Session: "Mobility 2015 Summer", Funding: 170000, Status: "Active", City: "Sunnyvale" },
                  { Name: "My Dealer Service", Session: "Mobility 2015 Summer", Funding: 390000, Status: "Active", City: "Denver" },
                  { Name: "Pitstop", Session: "Mobility 2015 Summer", Funding: 630000, Status: "Active", City: "Kitchener" },
                  { Name: "Revio", Session: "Mobility 2015 Summer", Funding: 620000, Status: "Active", City: "Louisville" },
                  { Name: "SPLT", Session: "Mobility 2015 Summer", Funding: 1320000, Status: "Active", City: "Detroit" },
                  { Name: "Wise Systems", Session: "Mobility 2015 Summer", Funding: 1530000, Status: "Active", City: "Cambridge" },
                  { Name: "Acerta", Session: "Mobility 2016 Summer", Funding: 120000, Status: "Active", City: "Waterloo" },
                  { Name: "Algocian", Session: "Mobility 2016 Summer", Funding: 80000, Status: "Active", City: "Waterloo" },
                  { Name: "Braiq", Session: "Mobility 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Cargo", Session: "Mobility 2016 Summer", Funding: 1460000, Status: "Active", City: "New York" },
                  { Name: "Donut Media", Session: "Mobility 2016 Summer", Funding: 1620000, Status: "Active", City: "Los Angeles" },
                  { Name: "Drive Spotter", Session: "Mobility 2016 Summer", Funding: 1110000, Status: "Active", City: "Omaha" },
                  { Name: "GoKid", Session: "Mobility 2016 Summer", Funding: 1120000, Status: "Active", City: "New York" },
                  { Name: "HAAS Alert", Session: "Mobility 2016 Summer", Funding: 140000, Status: "Active", City: "Chicago" },
                  { Name: "HERO", Session: "Mobility 2016 Summer", Funding: 80000, Status: "Active", City: "Austin" },
                  { Name: "Rally", Session: "Mobility 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Spatial AI", Session: "Mobility 2016 Summer", Funding: 2140000, Status: "Active", City: "Cincinnati" },
                  { Name: "Voyhoy", Session: "Mobility 2016 Summer", Funding: 300000, Status: "Active", City: "Santiago" },
                  { Name: "Chroma", Session: "Nike+ Accelerator 2013", Funding: 460000, Status: "Active", City: "Portland" },
                  { Name: "CoachBase", Session: "Nike+ Accelerator 2013", Funding: 800000, Status: "Acquired", City: "Tin Hau" },
                  { Name: "FitCause", Session: "Nike+ Accelerator 2013", Funding: 20000, Status: "Active", City: "New York" },
                  { Name: "FitDeck Mobile", Session: "Nike+ Accelerator 2013", Funding: 20000, Status: "Failed", City: "San Diego" },
                  { Name: "GeoPalz", Session: "Nike+ Accelerator 2013", Funding: 2020000, Status: "Active", City: "Boulder" },
                  { Name: "GoRecess", Session: "Nike+ Accelerator 2013", Funding: 520000, Status: "Active", City: "New York" },
                  { Name: "HighFive", Session: "Nike+ Accelerator 2013", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Incomparable Things Co", Session: "Nike+ Accelerator 2013", Funding: 20000, Status: "Failed", City: "New York" },
                  { Name: "NextStep IO", Session: "Nike+ Accelerator 2013", Funding: 350000, Status: "Failed", City: "Cedar Rapids" },
                  { Name: "Sprout Wellness Solutions", Session: "Nike+ Accelerator 2013", Funding: 1650000, Status: "Active", City: "Toronto" },
                  { Name: "Ambassador", Session: "NYC 2011 Summer", Funding: 2740000, Status: "Active", City: "Royal Oak" },
                  { Name: "Contently", Session: "NYC 2011 Summer", Funding: 13270000, Status: "Active", City: "New York" },
                  { Name: "Dispatch", Session: "NYC 2011 Summer", Funding: 970000, Status: "Acquired", City: "New York" },
                  { Name: "Lore", Session: "NYC 2011 Summer", Funding: 6010000, Status: "Acquired", City: "New York" },
                  { Name: "MobIntent", Session: "NYC 2011 Summer", Funding: 10000, Status: "Failed", City: "New York" },
                  { Name: "Ordrx", Session: "NYC 2011 Summer", Funding: 1690000, Status: "Failed", City: "New York" },
                  { Name: "Piictu", Session: "NYC 2011 Summer", Funding: 740000, Status: "Acquired", City: "New York" },
                  { Name: "SideTour", Session: "NYC 2011 Summer", Funding: 4010000, Status: "Acquired", City: "New York" },
                  { Name: "Spontaneously", Session: "NYC 2011 Summer", Funding: 760000, Status: "Failed", City: "New York" },
                  { Name: "Urtak", Session: "NYC 2011 Summer", Funding: 510000, Status: "Failed", City: "New York" },
                  { Name: "Wantworthy", Session: "NYC 2011 Summer", Funding: 1010000, Status: "Failed", City: "New York" },
                  { Name: "Welcome", Session: "NYC 2011 Summer", Funding: 17890000, Status: "Active", City: "New York" },
                  { Name: "CrowdTwist", Session: "NYC 2011 Winter", Funding: 15760000, Status: "Active", City: "New York" },
                  { Name: "IMRSV", Session: "NYC 2011 Winter", Funding: 2520000, Status: "Acquired", City: "New York" },
                  { Name: "Memoir", Session: "NYC 2011 Winter", Funding: 7080000, Status: "Active", City: "New York" },
                  { Name: "Nestio", Session: "NYC 2011 Winter", Funding: 11920000, Status: "Active", City: "New York" },
                  { Name: "OnSwipe", Session: "NYC 2011 Winter", Funding: 6010000, Status: "Acquired", City: "New York" },
                  { Name: "Overtime Media", Session: "NYC 2011 Winter", Funding: 290000, Status: "Active", City: "Brooklyn" },
                  { Name: "Red Rover", Session: "NYC 2011 Winter", Funding: 560000, Status: "Failed", City: "New York" },
                  { Name: "Shelby TV", Session: "NYC 2011 Winter", Funding: 4010000, Status: "Acquired", City: "New York" },
                  { Name: "ShuttleCloud", Session: "NYC 2011 Winter", Funding: 1040000, Status: "Active", City: "Chicago" },
                  { Name: "ThinkNear", Session: "NYC 2011 Winter", Funding: 1640000, Status: "Acquired", City: "Los Angeles" },
                  { Name: "Timehop", Session: "NYC 2011 Winter", Funding: 14140000, Status: "Active", City: "New York" },
                  { Name: "ToVieFor", Session: "NYC 2011 Winter", Funding: 10000, Status: "Failed", City: "New York" },
                  { Name: "Bench", Session: "NYC 2012 Summer", Funding: 29110000, Status: "Active", City: "New York" },
                  { Name: "Bondsy", Session: "NYC 2012 Summer", Funding: 760000, Status: "Failed", City: "Brooklyn" },
                  { Name: "ClassPass", Session: "NYC 2012 Summer", Funding: 84270000, Status: "Active", City: "New York" },
                  { Name: "Condition One", Session: "NYC 2012 Summer", Funding: 8200000, Status: "Active", City: "Palo Alto" },
                  { Name: "Karma", Session: "NYC 2012 Summer", Funding: 11960000, Status: "Active", City: "New York" },
                  { Name: "Lua", Session: "NYC 2012 Summer", Funding: 12950000, Status: "Active", City: "New York" },
                  { Name: "Marquee", Session: "NYC 2012 Summer", Funding: 110000, Status: "Active", City: "New York" },
                  { Name: "Moveline", Session: "NYC 2012 Summer", Funding: 5740000, Status: "Failed", City: "New York" },
                  { Name: "Pickie", Session: "NYC 2012 Summer", Funding: 1110000, Status: "Acquired", City: "New York" },
                  { Name: "Poptip", Session: "NYC 2012 Summer", Funding: 750000, Status: "Acquired", City: "South Bend" },
                  { Name: "Rewind Me", Session: "NYC 2012 Summer", Funding: 1210000, Status: "Failed", City: "New York" },
                  { Name: "SmallKnot", Session: "NYC 2012 Summer", Funding: 110000, Status: "Acquired", City: "New York" },
                  { Name: "Wander", Session: "NYC 2012 Summer", Funding: 1210000, Status: "Acquired", City: "New York" },
                  { Name: "AdYapper", Session: "NYC 2013 Spring", Funding: 6820000, Status: "Active", City: "Chicago" },
                  { Name: "Bluecore", Session: "NYC 2013 Spring", Funding: 27150000, Status: "Active", City: "Seattle" },
                  { Name: "Dash Labs", Session: "NYC 2013 Spring", Funding: 1320000, Status: "Active", City: "New York" },
                  { Name: "FaithStreet", Session: "NYC 2013 Spring", Funding: 1210000, Status: "Active", City: "Brooklyn" },
                  { Name: "Jukely", Session: "NYC 2013 Spring", Funding: 14570000, Status: "Active", City: "Brooklyn" },
                  { Name: "Klooff", Session: "NYC 2013 Spring", Funding: 410000, Status: "Acquired", City: "New York" },
                  { Name: "Lean Startup Machine", Session: "NYC 2013 Spring", Funding: 1610000, Status: "Active", City: "New York" },
                  { Name: "Placemeter", Session: "NYC 2013 Spring", Funding: 9230000, Status: "Acquired", City: "New York" },
                  { Name: "Plated", Session: "NYC 2013 Spring", Funding: 58660000, Status: "Active", City: "New York" },
                  { Name: "Sketchfab", Session: "NYC 2013 Spring", Funding: 8910000, Status: "Active", City: "New York" },
                  { Name: "Weespring", Session: "NYC 2013 Spring", Funding: 700000, Status: "Active", City: "New York" },
                  { Name: "CodeStarter", Session: "NYC 2014 Spring", Funding: 0, Status: "Active", City: "San Francisco" },
                  { Name: "Concert Window", Session: "NYC 2014 Spring", Funding: 1180000, Status: "Active", City: "New York" },
                  { Name: "Hollerback", Session: "NYC 2014 Spring", Funding: 430000, Status: "Failed", City: "New York" },
                  { Name: "Hullabalu", Session: "NYC 2014 Spring", Funding: 4410000, Status: "Active", City: "New York" },
                  { Name: "Infinit", Session: "NYC 2014 Spring", Funding: 2240000, Status: "Acquired", City: "Paris" },
                  { Name: "MakersKit", Session: "NYC 2014 Spring", Funding: 1880000, Status: "Active", City: "Los Angeles" },
                  { Name: "Matter IO", Session: "NYC 2014 Spring", Funding: 2990000, Status: "Failed", City: "Cambridge" },
                  { Name: "Pathgather", Session: "NYC 2014 Spring", Funding: 3710000, Status: "Active", City: "New York" },
                  { Name: "Planted", Session: "NYC 2014 Spring", Funding: 1010000, Status: "Active", City: "New York" },
                  { Name: "Rival Theory", Session: "NYC 2014 Spring", Funding: 660000, Status: "Active", City: "Albuquerque" },
                  { Name: "SocialSign.in", Session: "NYC 2014 Spring", Funding: 2010000, Status: "Active", City: "New York" },
                  { Name: "Standard Analytics", Session: "NYC 2014 Spring", Funding: 1530000, Status: "Active", City: "NY" },
                  { Name: "Tutum", Session: "NYC 2014 Spring", Funding: 2660000, Status: "Acquired", City: "New York" },
                  { Name: "Flip", Session: "NYC 2015 Fall", Funding: 1690000, Status: "Active", City: "New York" },
                  { Name: "Gloss Genius", Session: "NYC 2015 Fall", Funding: 110000, Status: "Active", City: "New York" },
                  { Name: "Gorgias", Session: "NYC 2015 Fall", Funding: 1640000, Status: "Active", City: "San Francisco" },
                  { Name: "GreatHorn", Session: "NYC 2015 Fall", Funding: 2530000, Status: "Active", City: "Boston" },
                  { Name: "Impact Health", Session: "NYC 2015 Fall", Funding: 4480000, Status: "Active", City: "Pasadena" },
                  { Name: "Jewelbots", Session: "NYC 2015 Fall", Funding: 680000, Status: "Active", City: "New York" },
                  { Name: "LiveLike", Session: "NYC 2015 Fall", Funding: 5000000, Status: "Active", City: "New York" },
                  { Name: "MAX", Session: "NYC 2015 Fall", Funding: 1690000, Status: "Active", City: "Lagos" },
                  { Name: "Mona", Session: "NYC 2015 Fall", Funding: 360000, Status: "Active", City: "Seattle" },
                  { Name: "Sailo", Session: "NYC 2015 Fall", Funding: 640000, Status: "Active", City: "New York" },
                  { Name: "Slash", Session: "NYC 2015 Fall", Funding: 2170000, Status: "Active", City: "NewYork" },
                  { Name: "SPIDR Tech", Session: "NYC 2015 Fall", Funding: 960000, Status: "Active", City: "Los Angeles" },
                  { Name: "Studio", Session: "NYC 2015 Fall", Funding: 110000, Status: "Active", City: "New York" },
                  { Name: "The Foodworks", Session: "NYC 2015 Fall", Funding: 1720000, Status: "Active", City: "NewYork" },
                  { Name: "BentoBox", Session: "NYC 2015 Winter", Funding: 2330000, Status: "Active", City: "New York" },
                  { Name: "Cartesian Co", Session: "NYC 2015 Winter", Funding: 110000, Status: "Active", City: "New York" },
                  { Name: "DataCamp", Session: "NYC 2015 Winter", Funding: 2200000, Status: "Active", City: "Cambridge" },
                  { Name: "Iris VR", Session: "NYC 2015 Winter", Funding: 10090000, Status: "Active", City: "" },
                  { Name: "Keymetrics", Session: "NYC 2015 Winter", Funding: 2260000, Status: "Active", City: "New York" },
                  { Name: "Localize", Session: "NYC 2015 Winter", Funding: 1160000, Status: "Active", City: "San Francisco" },
                  { Name: "LSQ", Session: "NYC 2015 Winter", Funding: 110000, Status: "Active", City: "New York" },
                  { Name: "Pilot", Session: "NYC 2015 Winter", Funding: 4000000, Status: "Active", City: "New York" },
                  { Name: "Spoon University", Session: "NYC 2015 Winter", Funding: 2520000, Status: "Acquired", City: "New York" },
                  { Name: "Stefans Head", Session: "NYC 2015 Winter", Funding: 260000, Status: "Failed", City: "New York" },
                  { Name: "Stream", Session: "NYC 2015 Winter", Funding: 1740000, Status: "Active", City: "Boulder" },
                  { Name: "UniqueSound", Session: "NYC 2015 Winter", Funding: 1110000, Status: "Failed", City: "New York City" },
                  { Name: "Electronic Gaming Federation", Session: "NYC 2016 Summer", Funding: 160000, Status: "Active", City: "New York City" },
                  { Name: "Forestry IO", Session: "NYC 2016 Summer", Funding: 670000, Status: "Active", City: "Charlottetown" },
                  { Name: "Grubbly Farms", Session: "NYC 2016 Summer", Funding: 1360000, Status: "Active", City: "Doraville" },
                  { Name: "Healthie", Session: "NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "IO pipe", Session: "NYC 2016 Summer", Funding: 2480000, Status: "Active", City: "Philadelphia" },
                  { Name: "Leblum", Session: "NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Mindmate", Session: "NYC 2016 Summer", Funding: 320000, Status: "Active", City: "New York City" },
                  { Name: "MyFin", Session: "NYC 2016 Summer", Funding: 1420000, Status: "Active", City: "New York" },
                  { Name: "OnFrontiers", Session: "NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Patch Homes", Session: "NYC 2016 Summer", Funding: 1610000, Status: "Active", City: "San Francisco" },
                  { Name: "Pollen", Session: "NYC 2016 Summer", Funding: 1450000, Status: "Active", City: "New York" },
                  { Name: "ProcessOut", Session: "NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York City" },
                  { Name: "Purple", Session: "NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Skopenow", Session: "NYC 2016 Summer", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Skywatch", Session: "NYC 2016 Summer", Funding: 2370000, Status: "Active", City: "Waterloo" },
                  { Name: "Conductor", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "De Ice", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "Somerville" },
                  { Name: "Dossier", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "Brooklyn" },
                  { Name: "EEVO", Session: "NYC 2015 Q1", Funding: 20000, Status: "Active", City: "New York" },
                  { Name: "Ephemeral Tattoos", Session: "NYC 2015 Q1", Funding: 620000, Status: "Active", City: "New York" },
                  { Name: "Halion Displays", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "Waterloo" },
                  { Name: "Lean Systems", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "Montreal" },
                  { Name: "Litimetrics", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "Los Angeles" },
                  { Name: "Narmi", Session: "NYC 2015 Q1", Funding: 220000, Status: "Active", City: "New York" },
                  { Name: "Stan Group", Session: "NYC 2015 Q1", Funding: 20000, Status: "Active", City: "New York" },
                  { Name: "ThinkLoot", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Thread Genius", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Vidrovr", Session: "NYC 2015 Q1", Funding: 160000, Status: "Active", City: "New York" },
                  { Name: "Vitae Industries", Session: "NYC 2015 Q1", Funding: 120000, Status: "Active", City: "Providence" },
                  { Name: "Carbon Robotics", Session: "Qualcomm 2015 Spring", Funding: 3110000, Status: "Active", City: "San Francisco" },
                  { Name: "CleverPet", Session: "Qualcomm 2015 Spring", Funding: 620000, Status: "Active", City: "San Diego" },
                  { Name: "CtrlWorks", Session: "Qualcomm 2015 Spring", Funding: 120000, Status: "Active", City: "Singapore" },
                  { Name: "Inova Drone", Session: "Qualcomm 2015 Spring", Funding: 120000, Status: "Active", City: "San Diego" },
                  { Name: "MUSE Robotics", Session: "Qualcomm 2015 Spring", Funding: 120000, Status: "Active", City: "San Diego" },
                  { Name: "Rational Robotics", Session: "Qualcomm 2015 Spring", Funding: 120000, Status: "Active", City: "San Diego" },
                  { Name: "Reach Robotics", Session: "Qualcomm 2015 Spring", Funding: 390000, Status: "Active", City: "Bristol" },
                  { Name: "Skyfront", Session: "Qualcomm 2015 Spring", Funding: 120000, Status: "Active", City: "San Diego" },
                  { Name: "Skysense", Session: "Qualcomm 2015 Spring", Funding: 240000, Status: "Active", City: "San Diego" },
                  { Name: "Solenica", Session: "Qualcomm 2015 Spring", Funding: 120000, Status: "Active", City: "San Diego" },
                  { Name: "Enertiv", Session: "RGA 2013", Funding: 1370000, Status: "Active", City: "New York" },
                  { Name: "Footmarks", Session: "RGA 2013", Funding: 4660000, Status: "Active", City: "Redmond" },
                  { Name: "Grove", Session: "RGA 2013", Funding: 2390000, Status: "Active", City: "Somerville" },
                  { Name: "Hammerhead", Session: "RGA 2013", Funding: 4070000, Status: "Active", City: "New York" },
                  { Name: "Keen Home", Session: "RGA 2013", Funding: 5970000, Status: "Active", City: "New York" },
                  { Name: "Kytelabs", Session: "RGA 2013", Funding: 120000, Status: "Active", City: "PR" },
                  { Name: "Owlet Baby Care", Session: "RGA 2013", Funding: 22510000, Status: "Active", City: "Provo" },
                  { Name: "QoL", Session: "RGA 2013", Funding: 120000, Status: "Active", City: "NJ" },
                  { Name: "Qualia", Session: "RGA 2013", Funding: 6660000, Status: "Active", City: "Chicago" },
                  { Name: "ringblingz", Session: "RGA 2013", Funding: 120000, Status: "Failed", City: "Boulder" },
                  { Name: "Astro", Session: "RGA 2015", Funding: 2810000, Status: "Active", City: "New York" },
                  { Name: "Bitfinder", Session: "RGA 2015", Funding: 7150000, Status: "Active", City: "San Francisco" },
                  { Name: "Chargifi", Session: "RGA 2015", Funding: 4020000, Status: "Active", City: "London" },
                  { Name: "Diagenetix", Session: "RGA 2015", Funding: 120000, Status: "Active", City: "Honolulu" },
                  { Name: "Filament", Session: "RGA 2015", Funding: 31730000, Status: "Active", City: "Reno" },
                  { Name: "Freedom Audio", Session: "RGA 2015", Funding: 120000, Status: "Active", City: "Orlando" },
                  { Name: "Kinetic", Session: "RGA 2015", Funding: 1460000, Status: "Active", City: "New York" },
                  { Name: "Latch", Session: "RGA 2015", Funding: 12990000, Status: "Active", City: "New York" },
                  { Name: "LISNR", Session: "RGA 2015", Funding: 14200000, Status: "Active", City: "Cincinnati" },
                  { Name: "SkySpecs", Session: "RGA 2015", Funding: 4290000, Status: "Active", City: "Ann Arbor" },
                  { Name: "AddStructure", Session: "Retail 2016 Summer", Funding: 1640000, Status: "Active", City: "New York" },
                  { Name: "Blueprint Registry", Session: "Retail 2016 Summer", Funding: 2550000, Status: "Active", City: "Seattle" },
                  { Name: "Branch Messenger", Session: "Retail 2016 Summer", Funding: 3430000, Status: "Active", City: "Minneapolis" },
                  { Name: "INSPECTOR IO", Session: "Retail 2016 Summer", Funding: 3710000, Status: "Active", City: "Minneapolis" },
                  { Name: "Its By U", Session: "Retail 2016 Summer", Funding: 290000, Status: "Active", City: "New York" },
                  { Name: "Makerbloks", Session: "Retail 2016 Summer", Funding: 460000, Status: "Active", City: "Montreal" },
                  { Name: "MakersKit", Session: "Retail 2016 Summer", Funding: 1880000, Status: "Active", City: "Los Angeles" },
                  { Name: "Nexosis", Session: "Retail 2016 Summer", Funding: 5660000, Status: "Active", City: "Westerville" },
                  { Name: "Revolar", Session: "Retail 2016 Summer", Funding: 4940000, Status: "Active", City: "Denver" },
                  { Name: "Spruce", Session: "Retail 2016 Summer", Funding: 120000, Status: "Active", City: "Denver" },
                  { Name: "GoMiles", Session: "Seattle 2010 Fall", Funding: 10000, Status: "Acquired", City: "Seattle" },
                  { Name: "Haiku Deck", Session: "Seattle 2010 Fall", Funding: 4390000, Status: "Active", City: "Seattle" },
                  { Name: "Highlighter", Session: "Seattle 2010 Fall", Funding: 1210000, Status: "Acquired", City: "Seattle" },
                  { Name: "InstaGift", Session: "Seattle 2010 Fall", Funding: 510000, Status: "Active", City: "Seattle" },
                  { Name: "RentMatch", Session: "Seattle 2010 Fall", Funding: 10000, Status: "Active", City: "Seattle" },
                  { Name: "RewardsForce", Session: "Seattle 2010 Fall", Funding: 210000, Status: "Failed", City: "Seattle" },
                  { Name: "The Shared Web", Session: "Seattle 2010 Fall", Funding: 380000, Status: "Acquired", City: "New York" },
                  { Name: "Thinkfuse", Session: "Seattle 2010 Fall", Funding: 530000, Status: "Acquired", City: "Seattle" },
                  { Name: "World Blender", Session: "Seattle 2010 Fall", Funding: 1210000, Status: "Failed", City: "Seattle" },
                  { Name: "Bluebox Now", Session: "Seattle 2011 Fall", Funding: 10000, Status: "Failed", City: "Seattle" },
                  { Name: "EveryMove", Session: "Seattle 2011 Fall", Funding: 6580000, Status: "Active", City: "Seattle" },
                  { Name: "FlexMinder", Session: "Seattle 2011 Fall", Funding: 2610000, Status: "Acquired", City: "Seattle" },
                  { Name: "GoChime", Session: "Seattle 2011 Fall", Funding: 1200000, Status: "Acquired", City: "New York" },
                  { Name: "Outreach", Session: "Seattle 2011 Fall", Funding: 30880000, Status: "Active", City: "Seattle" },
                  { Name: "Remitly", Session: "Seattle 2011 Fall", Funding: 66430000, Status: "Active", City: "Seattle" },
                  { Name: "Reveal", Session: "Seattle 2011 Fall", Funding: 2030000, Status: "Acquired", City: "Seattle" },
                  { Name: "Smore", Session: "Seattle 2011 Fall", Funding: 1710000, Status: "Active", City: "Seattle" },
                  { Name: "Vizify", Session: "Seattle 2011 Fall", Funding: 1420000, Status: "Acquired", City: "Portland" },
                  { Name: "Zipline", Session: "Seattle 2011 Fall", Funding: 35510000, Status: "Active", City: "San Francisco" },
                  { Name: "Apptentive", Session: "Seattle 2012 Fall", Funding: 12020000, Status: "Active", City: "Seattle" },
                  { Name: "Bizible Marketing Analytics", Session: "Seattle 2012 Fall", Funding: 10610000, Status: "Active", City: "Seattle" },
                  { Name: "Glider", Session: "Seattle 2012 Fall", Funding: 960000, Status: "Acquired", City: "Portland" },
                  { Name: "Leanplum", Session: "Seattle 2012 Fall", Funding: 47410000, Status: "Active", City: "San Francisco" },
                  { Name: "Linksy", Session: "Seattle 2012 Fall", Funding: 110000, Status: "Failed", City: "Seattle" },
                  { Name: "Maptia", Session: "Seattle 2012 Fall", Funding: 110000, Status: "Active", City: "Bath" },
                  { Name: "MobileDevHQ", Session: "Seattle 2012 Fall", Funding: 860000, Status: "Acquired", City: "Seattle" },
                  { Name: "Nveloped", Session: "Seattle 2012 Fall", Funding: 110000, Status: "Failed", City: "Arlington" },
                  { Name: "Sandglaz", Session: "Seattle 2012 Fall", Funding: 610000, Status: "Active", City: "Toronto" },
                  { Name: "Tred", Session: "Seattle 2012 Fall", Funding: 5750000, Status: "Active", City: "Seattle" },
                  { Name: "Chapter", Session: "Seattle 2013 Fall", Funding: 110000, Status: "Failed", City: "Berkeley" },
                  { Name: "CodeMentor", Session: "Seattle 2013 Fall", Funding: 2740000, Status: "Active", City: "Sunnyvale" },
                  { Name: "Cuecard", Session: "Seattle 2013 Fall", Funding: 110000, Status: "Failed", City: "Redmond" },
                  { Name: "Designlab", Session: "Seattle 2013 Fall", Funding: 380000, Status: "Active", City: "Seattle" },
                  { Name: "Inside Social", Session: "Seattle 2013 Fall", Funding: 1690000, Status: "Acquired", City: "Seattle" },
                  { Name: "Jova", Session: "Seattle 2013 Fall", Funding: 1530000, Status: "Active", City: "Seattle" },
                  { Name: "Shippable", Session: "Seattle 2013 Fall", Funding: 10060000, Status: "Active", City: "Bellevue" },
                  { Name: "Skilljar", Session: "Seattle 2013 Fall", Funding: 3710000, Status: "Active", City: "Seattle" },
                  { Name: "Sparktrend", Session: "Seattle 2013 Fall", Funding: 110000, Status: "Failed", City: "Issaquah" },
                  { Name: "Talio Labs", Session: "Seattle 2013 Fall", Funding: 2260000, Status: "Acquired", City: "Seattle" },
                  { Name: "Vetted", Session: "Seattle 2013 Fall", Funding: 110000, Status: "Active", City: "Palo Alto" },
                  { Name: "Crowsnest", Session: "Seattle 2014 Fall", Funding: 110000, Status: "Acquired", City: "San Francisco" },
                  { Name: "Garmentory", Session: "Seattle 2014 Fall", Funding: 3220000, Status: "Active", City: "Seattle" },
                  { Name: "Jargon", Session: "Seattle 2014 Fall", Funding: 310000, Status: "Acquired", City: "San Jose" },
                  { Name: "LiveStories", Session: "Seattle 2014 Fall", Funding: 3790000, Status: "Active", City: "Seattle" },
                  { Name: "Magicflix", Session: "Seattle 2014 Fall", Funding: 540000, Status: "Failed", City: "Redmond" },
                  { Name: "MightySignal", Session: "Seattle 2014 Fall", Funding: 2810000, Status: "Active", City: "San Francisco" },
                  { Name: "Streamline", Session: "Seattle 2014 Fall", Funding: 110000, Status: "Active", City: "Seattle" },
                  { Name: "Tiny Creative", Session: "Seattle 2014 Fall", Funding: 110000, Status: "Active", City: "Portland" },
                  { Name: "TouchBase", Session: "Seattle 2014 Fall", Funding: 110000, Status: "Active", City: "Seattle" },
                  { Name: "TrueFacet", Session: "Seattle 2014 Fall", Funding: 10300000, Status: "Active", City: "New York" },
                  { Name: "AtCipher", Session: "Seattle 2015 Fall", Funding: 270000, Status: "Active", City: "Seattle" },
                  { Name: "Brand AI", Session: "Seattle 2015 Fall", Funding: 280000, Status: "Active", City: "Kirkland" },
                  { Name: "Candy Jar", Session: "Seattle 2015 Fall", Funding: 670000, Status: "Failed", City: "Tukwila" },
                  { Name: "DataBlade", Session: "Seattle 2015 Fall", Funding: 130000, Status: "Active", City: "Seattle" },
                  { Name: "Fish Bowl VR", Session: "Seattle 2015 Fall", Funding: 410000, Status: "Active", City: "San Francisco" },
                  { Name: "Innervate", Session: "Seattle 2015 Fall", Funding: 2300000, Status: "Active", City: "Seattle" },
                  { Name: "Lightboard", Session: "Seattle 2015 Fall", Funding: 210000, Status: "Active", City: "Seattle" },
                  { Name: "Lightrail", Session: "Seattle 2015 Fall", Funding: 2860000, Status: "Active", City: "Victoria" },
                  { Name: "Matcherino", Session: "Seattle 2015 Fall", Funding: 1350000, Status: "Active", City: "La Jolla" },
                  { Name: "Mentio Technologies", Session: "Seattle 2015 Fall", Funding: 110000, Status: "Acquired", City: "Vancouver" },
                  { Name: "ZIIBRA", Session: "Seattle 2015 Fall", Funding: 1320000, Status: "Acquired", City: "Bellevue" },
                  { Name: "Beam", Session: "Seattle 2016 Spring", Funding: 390000, Status: "Acquired", City: "Bellevue" },
                  { Name: "DroneSeed", Session: "Seattle 2016 Spring", Funding: 840000, Status: "Active", City: "Seattle" },
                  { Name: "Fig", Session: "Seattle 2016 Spring", Funding: 1120000, Status: "Active", City: "New York" },
                  { Name: "Keepe", Session: "Seattle 2016 Spring", Funding: 330000, Status: "Active", City: "Seattle" },
                  { Name: "Kepler Communications", Session: "Seattle 2016 Spring", Funding: 5400000, Status: "Active", City: "Toronto" },
                  { Name: "Polly AI", Session: "Seattle 2016 Spring", Funding: 1230000, Status: "Active", City: "Seattle" },
                  { Name: "Reflect", Session: "Seattle 2016 Spring", Funding: 2620000, Status: "Active", City: "West Hollywood" },
                  { Name: "Shyft", Session: "Seattle 2016 Spring", Funding: 2040000, Status: "Active", City: "Toronto" },
                  { Name: "Validated", Session: "Seattle 2016 Spring", Funding: 170000, Status: "Active", City: "Seattle" },
                  { Name: "Coastline Market", Session: "Seattle 2017 Q1", Funding: 120000, Status: "Active", City: "Vancouver" },
                  { Name: "CuePath Innovation", Session: "Seattle 2017 Q1", Funding: 120000, Status: "Active", City: "Vancouver" },
                  { Name: "Hazel", Session: "Seattle 2017 Q1", Funding: 120000, Status: "Active", City: "" },
                  { Name: "LevelTen Energy", Session: "Seattle 2017 Q1", Funding: 870000, Status: "Active", City: "Seattle" },
                  { Name: "Silene Biotech", Session: "Seattle 2017 Q1", Funding: 120000, Status: "Active", City: "Seattle" },
                  { Name: "Stackery", Session: "Seattle 2017 Q1", Funding: 1870000, Status: "Active", City: "Portland" },
                  { Name: "Swym Corporation", Session: "Seattle 2017 Q1", Funding: 440000, Status: "Active", City: "Seattle" },
                  { Name: "Valid8", Session: "Seattle 2017 Q1", Funding: 120000, Status: "Active", City: "Shoreline" },
                  { Name: "VendorHawk", Session: "Seattle 2017 Q1", Funding: 120000, Status: "Active", City: "Seattle" },
                  { Name: "AkibaH", Session: "Sprint 2014", Funding: 300000, Status: "Active", City: "San Jose" },
                  { Name: "FitBark", Session: "Sprint 2014", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "Lifeline Response", Session: "Sprint 2014", Funding: 120000, Status: "Active", City: "Chicago" },
                  { Name: "Medicast", Session: "Sprint 2014", Funding: 1210000, Status: "Acquired", City: "Alpharetta" },
                  { Name: "Mindfire Technology", Session: "Sprint 2014", Funding: 290000, Status: "Failed", City: "Salt Lake City" },
                  { Name: "ollo wearables", Session: "Sprint 2014", Funding: 120000, Status: "Failed", City: "San Francisco" },
                  { Name: "Prime", Session: "Sprint 2014", Funding: 110000, Status: "Failed", City: "San Francisco" },
                  { Name: "Sickweather", Session: "Sprint 2014", Funding: 960000, Status: "Active", City: "Baltimore" },
                  { Name: "Tenacity", Session: "Sprint 2014", Funding: 1750000, Status: "Active", City: "Seattle" },
                  { Name: "Yosko", Session: "Sprint 2014", Funding: 290000, Status: "Active", City: "Los Angeles" },
                  { Name: "HealthID", Session: "Sprint 2015", Funding: 120000, Status: "Active", City: "Cranston" },
                  { Name: "Hidrate", Session: "Sprint 2015", Funding: 120000, Status: "Active", City: "Boulder" },
                  { Name: "iDoc24", Session: "Sprint 2015", Funding: 110000, Status: "Active", City: "Berkley" },
                  { Name: "Jolt Athletics", Session: "Sprint 2015", Funding: 120000, Status: "Active", City: "Boston" },
                  { Name: "Melon Health", Session: "Sprint 2015", Funding: 620000, Status: "Active", City: "San Francisco" },
                  { Name: "Ovatemp", Session: "Sprint 2015", Funding: 820000, Status: "Active", City: "Boston" },
                  { Name: "Oxie", Session: "Sprint 2015", Funding: 120000, Status: "Active", City: "Tel Aviv" },
                  { Name: "Rex Animal Health", Session: "Sprint 2015", Funding: 360000, Status: "Active", City: "Houston" },
                  { Name: "Triomi", Session: "Sprint 2015", Funding: 120000, Status: "Active", City: "Philadelphia" },
                  { Name: "Vertisense", Session: "Sprint 2015", Funding: 3290000, Status: "Failed", City: "New York" },
                  { Name: "backstitch", Session: "Sprint 2016", Funding: 220000, Status: "Active", City: "Detroit" },
                  { Name: "Karmies", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "Denver" },
                  { Name: "Leka", Session: "Sprint 2016", Funding: 570000, Status: "Active", City: "Paris" },
                  { Name: "Mycroft", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "Kansas City" },
                  { Name: "Nozzle", Session: "Sprint 2016", Funding: 550000, Status: "Active", City: "Lehi" },
                  { Name: "ResponsiveAds", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "New York" },
                  { Name: "SocialCapital", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "San Francisco" },
                  { Name: "SpaceView", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "Portland" },
                  { Name: "Stride AI", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "Lexington" },
                  { Name: "Super Dispatch", Session: "Sprint 2016", Funding: 120000, Status: "Active", City: "Kansas City" },
                  { Name: "Ecoisme", Session: "Virgin Media 2016 Summer", Funding: 200000, Status: "Active", City: "London" },
                  { Name: "GoalShouter", Session: "Virgin Media 2016 Summer", Funding: 0, Status: "Active", City: "Milan" },
                  { Name: "KonnectAgain", Session: "Virgin Media 2016 Summer", Funding: 1520000, Status: "Active", City: "Dublin" },
                  { Name: "Rally Networks", Session: "Virgin Media 2016 Summer", Funding: 100000, Status: "Active", City: "Venice Beach" },
                  { Name: "Sponsokit", Session: "Virgin Media 2016 Summer", Funding: 110000, Status: "Active", City: "Berlin" },
                  { Name: "Stepsize", Session: "Virgin Media 2016 Summer", Funding: 1020000, Status: "Active", City: "London" },
                  { Name: "Strong Pink", Session: "Virgin Media 2016 Summer", Funding: 460000, Status: "Active", City: "London" },
                  { Name: "Synervoz", Session: "Virgin Media 2016 Summer", Funding: 1070000, Status: "Active", City: "Toronto" },
                  { Name: "Teltoo", Session: "Virgin Media 2016 Summer", Funding: 100000, Status: "Active", City: "Madrid" },
                  { Name: "WizDish", Session: "Virgin Media 2016 Summer", Funding: 100000, Status: "Active", City: "Kidlington" }
           ];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

var counter = 0;

var states = {
    START: "_START",
    QUIZ: "_QUIZ"
};

const handlers = {
    "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

var startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    },
    "AnswerIntent": function() {
        var item = getItem(this.event.request.intent.slots);

        if (item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
            if (USE_CARDS_FLAG)
            {
                var imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};
                this.emit(":askWithCard", getSpeechDescription(item), REPROMPT_SPEECH, getCardTitle(item), getTextDescription(item), imageObj);
            }
            else
            {
                this.emit(":ask", getSpeechDescription(item), REPROMPT_SPEECH);
            }
        }
        else
        {
            this.emit(":ask", getBadAnswer(item), getBadAnswer(item));

        }
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


var quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        var random = getRandom(0, data.length-1);
        var item = data[random];

//      var propertyArray = Object.getOwnPropertyNames(item);
//      var property = propertyArray[getRandom(1, propertyArray.length-1)];

        if (this.attributes["counter"]%2 == 0)
        {
            var property = "Session";
        }
        else
        {
            var property = "Name";
        }

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        var question = getQuestion(this.attributes["counter"], property, item);
        var speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        var response = "";
        var item = this.attributes["quizitem"];
        var property = this.attributes["quizproperty"];

        var correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.emit(":tell", response + " " + EXIT_SKILL_MESSAGE);
        }
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (var slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].name == "Session")
            {

                var index = 0;
                var testArray = [
                    value.toString().toLowerCase(),
                    "techstars " + value.toString().toLowerCase(),
                    "tech stars " + value.toString().toLowerCase()
                ];

                while (index < 3) {
                    if (slots[slot].value.toString().toLowerCase() == testArray[index])
                    {
                        return true;
                    }
                    index++;
                }
            }
            else if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getRandomSymbolSpeech(symbol)
{
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots)
{
    var propertyArray = Object.getOwnPropertyNames(data[0]);
    var value;

    for (var slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (var property in propertyArray)
            {
                var item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    var text = "";

    for (var key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
