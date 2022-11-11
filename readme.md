## Installation

1. Clone the repository to your local machine `git clone https://github.com/whatjackhasmade/dalle-node.git`
1. Install the dependencies `npm install`
1. Clone `.env.example` to `.env` and fill with your Bearer token

## Getting a Bearer Token

1. Go to https://openai.com/dall-e-2/
1. Create a OpenAI Account
1. Go to https://labs.openai.com/
1. Open the Network Tab in Developer Tools
1. Type a prompt and press "Generate"
1. Look for fetch to https://labs.openai.com/api/labs/tasks
1. In the request header look for authorization then get the Bearer Token

## Generate images

1. Create an array of lyrics in `src/const/lyrics/{song-name}.ts`
1. Update the imported lyrics in `src/index.ts`, by default we are using `src/const/lyrics/riders-on-the-storm.ts`
1. Run `npm run dev` to generate the images
