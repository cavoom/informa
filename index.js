// INFORMA SKILL
// Simple ASK Skill
// Uses the freemanDemoAskSkill Lambda


'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'RecipeIntent': function () {
        console.log(Date.now() + parseInt(this.event.request.intent.value));
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myRecipes = this.t('RECIPES');
        const recipe = myRecipes[itemName];

        if (recipe) {
            this.attributes.speechOutput = recipe;
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
            this.emit(':askWithCard', recipe, this.attributes.repromptSpeech, cardTitle, recipe);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {

    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            SKILL_NAME: 'event con',
            //WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, when is the general session? ... Now, what can I help you with.",
            WELCOME_MESSAGE: "Hi there. I\'m your enforma Virtual Assistant, and I\'m here to help. You can ask a question like, when\'s lunch? ... Now, what can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, where can I get coffee, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, where is the auditorium, or you can say exit... Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye',
            //RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_REPEAT_MESSAGE: 'Anything else before I go? Just say stop if you are all done.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently don\'t know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the answer to your question. ',
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'about that. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'the answer to your question ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },

};

exports.handler = (event, context) => {
    //console.log(Date.now() + parseInt(this.event.request.intent.slots.number.value));
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

