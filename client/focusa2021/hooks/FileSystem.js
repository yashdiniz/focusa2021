import { StorageAccessFramework, getInfoAsync, makeDirectoryAsync, downloadAsync, deleteAsync } from 'expo-file-system';
import { ToastAndroid } from 'react-native';
import { directory, filesRealm } from '../config';


// Reference: https://docs.expo.io/versions/latest/sdk/filesystem/

/**
 * Checks if directory exists in cache.
 * Creates directory if does not exist.
 * Also checks for file permissions.
 */
async function ensureDirExists() {
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(directory);

    // TODO: Make a toast about it!
    if(!permissions.granted) {
        ToastAndroid.showWithGravityAndOffset(
            "We need STORAGE permissions to save documents offline.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        throw new Error("Please grant STORAGE permissions...");
    }

    const dirInfo = await getInfoAsync(directory);
    if (!dirInfo.exists) {
        console.log("Directory doesn't exist, creating...");
        await makeDirectoryAsync(directory, { intermediates: true });
    }
}

/**
 * Gets the file and stores it in cache.
 * @param {string} filename 
 * @returns {string} File URI on local device.
 */
export async function getFile(filename) {
    await ensureDirExists();
    const fileUri = directory + filename;
    const URL = filesRealm + '/file/' + filename;
    const fileInfo = await getInfoAsync(fileUri);
    if (!fileInfo.exists) {
        console.log(`The file ${fileUri} isn't cached locally. Downloading...`);
        await downloadAsync(URL, fileUri);
    }
    return fileUri;
}

/**
 * Deletes file from the cache.
 * @param {string} filename 
 */
export async function deleteFromCache(filename) {
    await ensureDirExists();
    const fileUri = directory + filename;
    await deleteAsync(fileUri);
}

export async function uploadFile() {
    // something
    // Reference: FilePicker https://docs.expo.io/versions/v41.0.0/sdk/document-picker/
    return;
}