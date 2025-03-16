const filesExtensions = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/svg+xml": "svg",
};

const dataUrlToFile = async (
  dataUrl: string,
  fileName: string
): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const fileExtensionType =
    filesExtensions[blob.type as keyof typeof filesExtensions];

  return new File([blob], fileName + "." + fileExtensionType, {
    type: fileExtensionType,
    lastModified: new Date().getDate(),
  });
};

export default dataUrlToFile;
