import type { PreSignUpTriggerHandler } from 'aws-lambda';

export const handler: PreSignUpTriggerHandler = async (event) => {
  const { userAttributes } = event.request;

  // Safely access attributes with type guards
  const email = userAttributes['email'];
  if (!email) {
    throw new Error('Email is required');
  }

  const reliableTransport = userAttributes['custom:reliableTransportation']?.toLowerCase();
  if (reliableTransport !== 'yes') {
    throw new Error('You must have reliable transportation to join as a maid.');
  }

  const scheduleReliability = userAttributes['custom:scheduleReliability']?.toLowerCase();
  if (scheduleReliability !== 'yes') {
    throw new Error('You must be able to stick to a schedule and arrive on time.');
  }

  const backgroundConsent = userAttributes['custom:backgroundCheckConsent']?.toLowerCase();
  if (backgroundConsent !== 'yes') {
    throw new Error('You must consent to a background check to join.');
  }

  return event;
};