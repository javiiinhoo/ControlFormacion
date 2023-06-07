let activeImgIndex = 0;
    const galleryImgs = document.querySelectorAll('.gallery img');
    setInterval(() => {
        const nextImgIndex = activeImgIndex + 1 < galleryImgs.length ? activeImgIndex + 1 : 0;
        galleryImgs[activeImgIndex].classList.remove('active');
        galleryImgs[nextImgIndex].classList.add('active');
        activeImgIndex = nextImgIndex;
    }, 5000);