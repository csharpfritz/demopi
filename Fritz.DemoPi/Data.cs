using LINQtoCSV;

namespace Fritz.DemoPi;


public class ClickRecord
{

	[CsvColumn(Name = "Time", FieldIndex = 1, OutputFormat = "MM/dd/yyyy HH:mm:ss")]
	public DateTime Timestamp { get; set; }

}

public class DataRepository
{

	public const string Filename = "ClickCount.csv";

	public int GetCurrentCount()
	{

		if (!File.Exists(Filename))
		{
			var f = File.Create(Filename);
			f.Dispose();
		}

		var context = new CsvContext();
		var records = context.Read<ClickRecord>(Filename);

		return records.Count();

	}

	public int AddClick(DateTimeOffset timeStamp)
	{

		if (!File.Exists(Filename))
		{
			var f = File.Create(Filename);
			f.Dispose();
		}

		var context = new CsvContext();
		var newRecord = new ClickRecord { Timestamp = timeStamp.LocalDateTime };

		var records = context.Read<ClickRecord>(Filename).ToList();
		records.Add(newRecord);

		context.Write(records, Filename);

		return records.Count();

	}

}