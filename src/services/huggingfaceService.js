const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

const generateEmbedding = async (text) => {

    const embedding = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: text
    });

    return embedding;

};

module.exports = {
    generateEmbedding
};