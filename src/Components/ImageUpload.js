import React, { useState } from "react";
import "../styles/ImageUpload.css";
import { Input, Button } from "@material-ui/core";
import { db } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ImageUpload({ userName }) {
	const [caption, setCaption] = useState(null);
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const [onProgress, setOnProgress] = useState(false);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0])
		}
	}

	const handleUpload = () => {
		const storage = getStorage();
		const storageRef = ref(storage, `images/${image.name}`);

		const uploadTask = uploadBytesResumable(storageRef, image);

		uploadTask.on('state_changed', 
		  (snapshot) => {
		    const progress = Math.round(
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			)
			setProgress(progress)
			setOnProgress(true);
		  }, 
		  (error) => {
		    alert(error.message);
		    setOnProgress(false);
		  }, 
		  () => {
		    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
		      addDoc(collection(db, "posts"), {
						timestamp: serverTimestamp(),
						caption: caption,
						imageUrl: url,
						userName: userName
				}).then(() => {
					setProgress("");
					setCaption("");
					setImage(null);
					setOnProgress(false);
				})
		    });
		  }
);
}
	
	return (
		<div className="imageUpload">
			<progress 
				value={progress} 
				max="100" 
				className="imageUpload__progress"
			/>
			<Input 
				placeholder="Enter a caption..." 
				type="text" 
				value={caption}
				onChange={e => setCaption(e.target.value)}
			/>
			<input type="file" onChange={handleChange} />
			<Button disabled={!image || onProgress} onClick={handleUpload}>
				{ onProgress ? "Uploading..." : "Upload" }
			</Button>
		</div>
	)
}

export default ImageUpload;