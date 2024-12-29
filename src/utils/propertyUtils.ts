import { mockProperties } from '../data/mockData';

export const getRandomProperty = () => {
  const randomIndex = Math.floor(Math.random() * mockProperties.length);
  return mockProperties[randomIndex];
};