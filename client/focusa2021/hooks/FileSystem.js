import { StorageAccessFramework, getInfoAsync, makeDirectoryAsync, downloadAsync, deleteAsync, uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { getDocumentAsync } from 'expo-document-picker';
import { ToastAndroid } from 'react-native';
import { directory, filesRealm } from '../config';
import { refresh } from '../hooks/authenticate';
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
    refresh();  // need to refresh the token to upload
    
    const URL = filesRealm + '/upload';
    let documentSelected = await getDocumentAsync();

    // nothing to upload if user presses cancel
    if(documentSelected.type === 'cancel') return '';

    // also prevent upload if the file size is too large
    if(documentSelected.size > (25 * (1<<20))) {
        ToastAndroid.showWithGravityAndOffset(
            "The file being uploaded is too large. We do not support files larger than 25MB unless through a cloud drive.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        return '';
    }

    if(documentSelected.type === 'success') {
        let result = await uploadAsync(URL, documentSelected.uri, {
            headers: {
                authorization: getToken(),
            },
            httpMethod: 'POST',
            uploadType: FileSystemUploadType.MULTIPART,
            fieldName: 'attachment',
        });
        console.log(new Date(), 'Upload result', result);
        return result;
    }
}