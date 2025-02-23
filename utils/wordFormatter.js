function wordFormatter(str) {
  const lowercaseStr = str.toLocaleLowerCase("tr-TR");

  // Her kelimenin ilk harfini büyük yapar, Türkçe karakterleri dikkate alarak
  return lowercaseStr
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ");
}

export default wordFormatter;