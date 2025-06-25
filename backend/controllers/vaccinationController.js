import Vaccination from '../models/Vaccination.js';
import Flock from '../models/Flock.js';
import ExcelJS from 'exceljs';


export const createVaccination = async (req, res) => {
  try {
    const newRecord = new Vaccination({ ...req.body, farm: req.user._id });
    await newRecord.save();
    res.status(201).json({ message: 'Vaccination record saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save record', error: err.message });
  }
};

export const getVaccinations = async (req, res) => {
  try {
    const records = await Vaccination.find({ farm: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
};


export const getVaccinationStats = async (req, res) => {
  try {
    const farmId = req.user._id;

    const flocks = await Flock.find({ farm: farmId, status: 'active' });
    const vaccinations = await Vaccination.find({ farm: farmId });

    const totalBatches = flocks.length;
    const totalBirds = flocks.reduce((sum, f) => sum + (f.birdCount || 0), 0);
    const vaccinatedBirds = vaccinations.reduce((sum, v) => sum + (v.vaccinatedCount || 0), 0);

    const nextDueDates = vaccinations
      .map(v => v.nextVaccinationDate)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));

    const missed = vaccinations.filter(v => {
      const due = new Date(v.dateTime);
      return due < new Date();
    });

    res.status(200).json({
      totalBatches,
      vaccinationCoverage: totalBirds > 0 ? Math.min(100, ((vaccinatedBirds / totalBirds) * 100).toFixed(1)) : 0,
      nextDoseDue: nextDueDates[0] || null,
      missedCount: missed.length,
      mortalityRate: 1.5 // placeholder, you can calculate from a real field
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};



export const getVaccinationChartData = async (req, res) => {
  try {
    const farmId = req.user._id;

    const flocks = await Flock.find({ farm: farmId });
    const vaccinations = await Vaccination.find({ farm: farmId });

    const chartData = flocks.map(flock => {
      const vaccinatedForThisFlock = vaccinations
        .filter(v => v.flockName === flock.flockName)
        .reduce((sum, v) => sum + (v.vaccinatedCount || 0), 0);

      const percentage = flock.birdCount
        ? Math.min(100, ((vaccinatedForThisFlock / flock.birdCount) * 100).toFixed(1))
        : 0;

      return {
        flockName: flock.flockName,
        percentage: Number(percentage)
      };
    });

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chart data', error: err.message });
  }
};

export const getNextVaccination = async (req, res) => {
  try {
    const farmId = req.user._id;

    const upcoming = await Vaccination.find({
      farm: farmId,
      nextVaccinationDate: { $gte: new Date() }
    })
      .sort({ nextVaccinationDate: 1 })
      .limit(1);

    if (!upcoming.length) {
      return res.json(null);
    }

    const next = upcoming[0];
    res.json({
      flock: next.flockName,
      vaccine: next.vaccineName,
      date: next.nextVaccinationDate
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch next vaccination", error: err.message });
  }
};


// New controller functions for edit/delete/export
export const updateVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecord = await Vaccination.findOneAndUpdate(
      { _id: id, farm: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found or not authorized' });
    }
    
    res.json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update record', error: err.message });
  }
};

export const deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Vaccination.findOneAndDelete({
      _id: id,
      farm: req.user._id
    });
    
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found or not authorized' });
    }
    
    res.json({ message: 'Vaccination record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete record', error: err.message });
  }
};

export const exportVaccinations = async (req, res) => {
  try {
    const records = await Vaccination.find({ farm: req.user._id }).sort({ dateTime: -1 });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vaccination Records');

    // Add headers
    worksheet.columns = [
      { header: 'Flock Name', key: 'flockName', width: 20 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Breed', key: 'breed', width: 15 },
      { header: 'Age (days)', key: 'age', width: 10 },
      { header: 'Vaccine Name', key: 'vaccineName', width: 20 },
      { header: 'Vaccine Type', key: 'vaccineType', width: 15 },
      { header: 'Manufacturer', key: 'manufacturer', width: 20 },
      { header: 'Batch Number', key: 'vaccineBatch', width: 15 },
      { header: 'Expiry Date', key: 'expiryDate', width: 12 },
      { header: 'Dosage', key: 'dosage', width: 15 },
      { header: 'Date Administered', key: 'dateTime', width: 18 },
      { header: 'Administered By', key: 'administeredBy', width: 18 },
      { header: 'Number Vaccinated', key: 'vaccinatedCount', width: 15 },
      { header: 'Withdrawal Time', key: 'withdrawalTime', width: 15 },
      { header: 'Health Check', key: 'preHealthCheck', width: 20 },
      { header: 'Reactions', key: 'postReactions', width: 20 },
      { header: 'Next Vaccination', key: 'nextVaccinationDate', width: 18 }
    ];

    // Format headers
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add data rows
    records.forEach(record => {
      worksheet.addRow({
        flockName: record.flockName,
        type: record.type,
        breed: record.breed,
        age: record.age,
        vaccineName: record.vaccineName,
        vaccineType: record.vaccineType,
        manufacturer: record.manufacturer,
        vaccineBatch: record.vaccineBatch,
        expiryDate: record.expiryDate?.toISOString().split('T')[0] || '',
        dosage: record.dosage,
        dateTime: record.dateTime?.toISOString().split('T')[0] || '',
        administeredBy: record.administeredBy,
        vaccinatedCount: record.vaccinatedCount,
        withdrawalTime: record.withdrawalTime,
        preHealthCheck: record.preHealthCheck,
        postReactions: record.postReactions,
        nextVaccinationDate: record.nextVaccinationDate?.toISOString().split('T')[0] || ''
      });
    });

    // Format date columns
    [9, 10, 16].forEach(colNum => {
      worksheet.columns[colNum].numFmt = 'yyyy-mm-dd';
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=poultry_vaccinations_${new Date().toISOString().split('T')[0]}.xlsx`
    );

    // Send the file
    res.status(200);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate Excel file', error: err.message });
  }
};