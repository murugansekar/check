const { Configuration, OpenAIApi } = require('openai');

exports.getAIResponse = async (req, res) => {
    try {
        const configuration = new Configuration({
            apiKey: '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'
        });
        const openai = new OpenAIApi(configuration);
        const question = req.body.question;
        const openaiResponses = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: question,
        temperature: 0.5,
        max_tokens: 3500,
        top_p: 1
        });
        const rawData = openaiResponses.data.choices[0].text;
        return res.send(rawData);
    } catch(error) {
        console.log(error);
    }
};











