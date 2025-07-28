// linkedinApi.js
export const postToLinkedIn = async ({ orgId, accessToken, postText, selectedImages }) => {
  console.log(selectedImages, "selectedImages");
  try {
    let mediaPayload = [];
    for (const image of selectedImages) {
      // Register upload
      const registerResponse = await fetch(
        'https://api.linkedin.com/v2/assets?action=registerUpload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
              owner: `urn:li:organization:${orgId}`,
              serviceRelationships: [
                {
                  relationshipType: 'OWNER',
                  identifier: 'urn:li:userGeneratedContent',
                },
              ],
            },
          }),
        }
      );

      const registerData = await registerResponse.json();
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerData.value.asset;

      // Fetch image as blob
      const imageData = await fetch(image.path);
      const imageBlob = await imageData.blob();

      // Upload image blob
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': image.mime || 'image/jpeg',
          'Content-Length': imageBlob.size,
        },
        body: imageBlob,
      });
      mediaPayload.push({
        status: 'READY',
        description: { text: postText },
        media: asset,
        title: { text: 'Post image' },
      });
    }
    // Prepare post payload
    const payload = {
      author: `urn:li:organization:${orgId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: postText },
          shareMediaCategory: mediaPayload.length > 0 ? 'IMAGE' : 'NONE',
          ...(mediaPayload.length > 0 ? { media: mediaPayload } : {}),
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // Post the content
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    console.log(response, "Postresponse")
    return { success: true };
  } catch (error) {
    console.error('LinkedIn Post API error:', error);
    return { success: false, error: error.message };
  }
};

export const getPostDetails = async (accessToken, postUrn) => {
  // const url = `https://api.linkedin.com/rest/posts/${encodeURIComponent(postUrn)}`;
  const url = `https://api.linkedin.com/v2/ugcPosts/${encodeURIComponent(postUrn)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202310',  // Replace with the actual version you're using
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const postData = await response.json();
    // console.log('Post data retrieved successfully:', postData);
    return { success: true, data: postData };
  } catch (error) {
    console.error('Error fetching post details:', error);
    return { success: false, error: error.message };
  }
};

// Update the LinkedIn post using fetch
export const updatePostToLinkedIn = async (payload) => {
  const { postId, orgId, accessToken, postText, selectedImages } = payload;

  // Prepare the media data
  const media = selectedImages.map(img => ({
      status: 'READY',
      media: {
          status: 'READY',
          originalUrl: img.uri,  // URL or URI of the image
      },
      description: {
          text: img.description || 'No description',  // Optional description of the image
      },
  }));

  // Prepare the data to send to LinkedIn API
  const data = {
      author: `urn:li:organization:${orgId}`,  // Author of the post, in this case an organization
      lifecycleState: 'PUBLISHED',  // Post is being published
      specificContent: {
          'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                  text: postText,  // Updated text content for the post
              },
              media,  // Attach the media (images)
          },
      },
      visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',  // Visibility of the post
      },
  };

  // Log all the data to inspect before sending the request
  console.log("Payload for updating LinkedIn post:", payload);
  console.log("Data being sent to LinkedIn API:", data);

  try {
      // Make the PUT request to LinkedIn's API to update the post using fetch
      // https://api.linkedin.com/rest/posts/${encodeURIComponent(postUrn)}
      const response = await fetch(`https://api.linkedin.com/rest/posts/${encodeURIComponent(postId)}`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${accessToken}`,  // Authorization header with access token
              'X-Restli-Protocol-Version': '2.0.0',  // LinkedIn protocol version
              'Content-Type': 'application/json',  // Content type for the request
          },
          body: JSON.stringify(data),  // Convert data to JSON string for the request body
      });

      // Log the response status and data
      console.log("Response status:", response.status);
      
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Response data from LinkedIn:", responseData);

      return responseData;  // Return the response data from LinkedIn's API
  } catch (error) {
      console.error('Error updating LinkedIn post:', error);
      return { success: false, error: error.message };  // Handle errors
  }
};
