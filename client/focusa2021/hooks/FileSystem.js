import { StorageAccessFramework, getInfoAsync, makeDirectoryAsync, downloadAsync, deleteAsync, uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { getDocumentAsync } from 'expo-document-picker';
import { ToastAndroid } from 'react-native';
import { directory, filesRealm } from '../config';
import { getToken } from './store';


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
        throw new Error("Please grant us the STORAGE permission to work effectively...");
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


// Reference: FilePicker https://docs.expo.io/versions/v41.0.0/sdk/document-picker/
export async function uploadFile() {


    const URL = filesRealm + '/upload';
    const authorization = `Bearer ${getToken()}`;

    // wait for user to select a file
    const documentSelected = await getDocumentAsync();
    // nothing to upload if user presses cancel
    if(documentSelected.type === 'cancel') return '';

    // also prevent upload if the file size is too large (only client side check lol)
    // TODO: put a server side check to prevent an attack!
    if(documentSelected.size > (25 * (1>>20))) {
        ToastAndroid.showWithGravityAndOffset(
            "The file being uploaded is too large. We do not support files larger than 25MB unless through a cloud drive.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    }

    const fileUri = documentSelected.uri;   // get URI of the file if successful.

    const uploadResult = await uploadAsync(URL, fileUri, {
        headers: {
            authorization,
        },
        httpMethod: 'PATCH',
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: 'attachment',
    });

    uploadResult.status; // ?
}