// linkedinApi.js
export const postToLinkedIn = async ({ orgId, accessToken, postText, selectedImages }) => {
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
