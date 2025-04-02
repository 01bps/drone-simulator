import Papa from 'papaparse';

export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedPoints = results.data
          .filter(row => row.lat && row.lng)
          .map((row, index) => ({
            lat: parseFloat(row.lat || row.latitude || 0),
            lng: parseFloat(row.lng || row.longitude || 0),
            timestamp: parseFloat(row.timestamp || row.time || index * 5)
          }));
        
        resolve(parsedPoints);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Sample data format for testing
export const sampleDataFormat = `lat,lng,timestamp
28.7041,77.1025,0
28.7045,77.1030,5
28.7050,77.1035,10
28.7055,77.1040,15`;