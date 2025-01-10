let cropper;

// Handle image upload
document.getElementById('uploadImage').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const image = document.createElement('img');
      image.src = event.target.result;
      document.getElementById('preview').innerHTML = ''; // Clear previous content
      document.getElementById('preview').appendChild(image);

      // Initialize the cropper
      if (cropper) {
        cropper.destroy();
      }
      cropper = new Cropper(image, {
        aspectRatio: 381 / 495, // Fixed aspect ratio of 381x495
        viewMode: 1,
        scalable: true,
        zoomable: true,
        cropBoxResizable: true,
      });
    };
    reader.readAsDataURL(file);
  }
});

// Download cropped image
document.getElementById('downloadBtn').addEventListener('click', function () {
  const lastName = document.getElementById('lastName').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const middleInitial = document.getElementById('middleInitial').value.trim();

  // Validate the name fields
  if (!lastName || !firstName || !middleInitial) {
    alert('Please enter your last name, first name, and middle initial.');
    return;
  }

  // Construct the full name in the correct format
  let fullName = `${lastName}, ${firstName} ${middleInitial}`;

  // Ensure no extra dot after the middle initial
  if (middleInitial.slice(-1) !== '.') {
    fullName = `${lastName}, ${firstName} ${middleInitial}.`;
  }

  if (cropper) {
    const canvas = cropper.getCroppedCanvas({
      width: 381,
      height: 495,
    });
    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fullName}.jpg`; // Ensure the file name ends with .jpg
      a.click();
    }, 'image/jpeg'); // Ensure the mime type is 'image/jpeg' for JPG images
  } else {
    alert("Please upload and crop an image first.");
  }
});