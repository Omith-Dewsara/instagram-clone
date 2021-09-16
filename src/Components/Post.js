import React, { useEffect, useState } from "react";
import "../styles/Post.css";
import { Avatar } from "@material-ui/core";
import { db } from "../firebase";
import { onSnapshot, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

function Post({ userName, imageUrl, caption, postId, user }) {

	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');

	useEffect(() => {
		onSnapshot(query(collection(db, "posts", postId, "comments"), orderBy("timestamp", "desc")), snapshot => {
			setComments(snapshot.docs.map(doc => ({ id: doc.id, comment: doc.data() })))
		})
	}, [postId])

	const postComment = (e) => {
		e.preventDefault();

		addDoc(collection(db, "posts", postId, "comments"), {
			userName: userName,
			text: comment,
			timestamp: serverTimestamp()
		})
		setComment("");
	}

	return (
		<div className="post">
			<div className="post__header">
				<Avatar 
					src="/"
					alt={userName}
					className="post__avatar"
				/>
				<h3> { userName } </h3>
			</div>

			<img
				src={imageUrl}
				alt=""
				className="post__image"
			/>
			<h4 className="post__text"> <strong> { userName } </strong>  { caption && " : " + caption } </h4>
			<div className="post__commentBox">
				<div className="post__comments">
					{
						comments.map(({id, comment}) => (
							<p key={id}>
								<strong> {comment.userName} </strong> {comment.text}
							</p>
						))
					}
				</div>

				{
					user && (
						<form>
							<input 
								className="post__input"
								type="text"
								placeholder="Add a comment..."
								value={comment}
								onChange={e => setComment(e.target.value)}
							/>
							<button
								disabled={!comment}
								className="post__button"
								type="submit"
								onClick={postComment}
							>
								Post
							</button>
						</form>
					)
				}
			</div>
		</div>
	)
}

export default Post;