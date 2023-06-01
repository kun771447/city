import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
 
const fbxLoader = new FBXLoader();

export const loadFBX = (url) => {
    return new Promise((resolve, reject) => {
        const onLoad = (res) => {
            resolve(res)
        };

        const onProgress = () => {};
        
        const onError =  (error) => {
            reject(error)
        }
        
        fbxLoader.load(url, onLoad, onProgress, onError)
    })
}