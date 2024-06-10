import { AvatarGenerator } from 'random-avatar-generator';
import { uniqueNamesGenerator, Config, adjectives, animals } from 'unique-names-generator';

export const getFileSize = (size: number) => {
  if (size < 1024) return `${size} Bytes`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// export const getFileTypeIcon = (type: string) => {
//   const fileTypeList: string[] = [
//     "image/jpeg",
//     "image/png",
//     "application/pdf",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/x-zip-compressed",
//   ];
// }

export const getAvatar = () => {
  const generator = new AvatarGenerator();
  const avatar = generator.generateRandomAvatar();
  return avatar;
}

export const getName = () => {
  const customConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2,
    style: 'capital'
  };
  const randomName: string = uniqueNamesGenerator(customConfig);
  return randomName;
}