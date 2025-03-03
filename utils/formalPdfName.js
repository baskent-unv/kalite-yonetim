export const formatFileName = (originalName, uniqueSuffix, extension) => {
    // Türkçe karakterleri İngilizce karşılıkları ile değiştir
    let formattedName = originalName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Unicode normalizasyonu ile aksanları temizle
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O');
      
    // Özel karakterleri (boşluklar, /, #, &) temizle
    formattedName = formattedName.replace(/[^a-zA-Z0-9]/g, '-'); // URL dostu karakterlere çevir
    
    // Birden fazla tireyi tek tireye indir
    formattedName = formattedName.replace(/-+/g, '-');
    
    // İsimlendirme kurallarına göre birleştir
    return `${formattedName.toLowerCase()}-${uniqueSuffix}${extension}`;
  }
  