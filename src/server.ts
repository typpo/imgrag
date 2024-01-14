import path from 'node:path';

import express from 'express';
import { generate } from './generate';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate-image', async (req: express.Request, res: express.Response) => {
  try {
    const query = req.body.query;
    if (!query) {
      return res.status(400).send({ error: 'Query is required' });
    }
    const imageUrl = await generate(query);
    res.status(200).send({ imageUrl });
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
