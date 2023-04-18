import axios from 'axios';
import { useRouter } from 'next/router';
 
export default async (req, res) => {
  const {
    method,
    headers,
    query,
    body,
  } = req;
  const router = useRouter();
 
  const apiUrl = `https://api.beet.digital/${router.asPath}`;
 
  try {
    const response = await axios({
      method,
      headers,
      params: query,
      data: body,
      url: apiUrl,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const { response: { status, data } = { status: 500, data: {} } } = error;
    res.status(status).json(data);
  }
};
