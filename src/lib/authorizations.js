'use server';

import { cookies, headers } from 'next/headers';
import { auth, db } from './firebase-admin';

/**
 * Retrieves the current user based on the session cookie.
 *
 * @returns {Promise<Object|null>} An object containing the user’s id and data, or null if not found.
 */
export async function getCurrentUser() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const userQuerySnapshot = await db
      .collection('users')
      .where('uid', '==', uid)
      .limit(1)
      .get();

    if (userQuerySnapshot.empty) return null;

    const userDoc = userQuerySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

/**
 * Retrieves the gym ID from the server-side request headers.
 *
 * @returns {Promise<string|null>} The gym ID or null if not found.
 */
export async function getGymIdServerSide() {
  return (await headers()).get('x-gym-id');
}

/**
 * Checks if the given user has the role of a gym owner.
 *
 * @param {Object} user - The user object.
 * @returns {boolean} True if the user is a gym owner; otherwise, false.
 */

/**
 * Retrieves a gym document by its ID.
 *
 * @param {string} gymId - The ID of the gym.
 * @returns {Promise<Object|null>} An object containing the gym’s id and data, or null if not found.
 */
export async function getGymById(gymId) {
  if (!gymId) return null;

  try {
    const gymDocRef = db.collection('gyms').doc(gymId);
    const gymDoc = await gymDocRef.get();

    if (!gymDoc.exists) return null;

    return { id: gymDoc.id, ...gymDoc.data() };
  } catch (error) {
    console.error('Error fetching gym:', error);
    return null;
  }
}

/**
 * Retrieves the current gym based on the gym ID found in the request headers.
 *
 * @returns {Promise<Object|null>} An object containing the gym’s id and data, or null if not found.
 */
export async function getCurrentGym() {
  const gymId = await getGymIdServerSide();
  return getGymById(gymId);
}

/**
 * Checks if the gym (specified by an optional gym ID or via request headers) belongs to the current user.
 *
 * @param {string} [providedGymId] - Optional gym ID. If not provided, the function will attempt to get it from headers.
 * @returns {Promise<boolean>} True if the current user is the owner of the gym; otherwise, false.
 */
export async function isCurrentGymBelongsToUser(providedGymId) {
  try {
    const gymId = providedGymId || (await getGymIdServerSide());
    const gym = await getGymById(gymId);
    if (!gym) return false;

    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    // Compare the owner's reference (gym.owner is a DocumentReference) with the current user's id.
    // Ensure gym.owner is valid and has an id property.
    if (!gym.owner || !gym.owner.id) {
      console.error('Gym owner reference is invalid.');
      return false;
    }

    return gym.owner.id === currentUser.id;
  } catch (error) {
    console.error('Error checking gym ownership:', error);
    return false;
  }
}
