import axios from 'axios';
import { User } from '../models';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || '';
const ENDPOINT = '/api/user';

// Dummy function to demonstrate the usage of the User model
export function getUser() {
  const apiClient = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return apiClient.get<User>(
    `${ENDPOINT}`
  );
}
