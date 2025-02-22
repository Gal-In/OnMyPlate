const filesExtensions = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/svg+xml": "svg",
};

const dataUrlToFile = async (
  dataUrl: string,
  fileName: string
): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return new File(
    [blob],
    fileName + "." + filesExtensions[blob.type as keyof typeof filesExtensions],
    {
      type: blob.type,
      lastModified: new Date().getDate(),
    }
  );
};

export default dataUrlToFile;
