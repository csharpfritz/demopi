using Microsoft.AspNetCore.SignalR;
using System.Reflection;

namespace Fritz.DemoPi;

public class CounterHub : Hub
{
	private readonly DataRepository _Repository;

	public CounterHub(DataRepository repository)
	{
		_Repository = repository;
	}

	public async Task<string> GetCurrentSha()
	{

		var version = Assembly.GetExecutingAssembly()
			.GetCustomAttributes<AssemblyInformationalVersionAttribute>()
			.First().InformationalVersion;

		if (version.Contains("+")) version = version.Split('+')[1];

		return version;

	}

	public async Task<int> Click()
	{

		return _Repository.AddClick(DateTimeOffset.UtcNow);

	}

	public async Task<int> GetCount()
	{

		return _Repository.GetCurrentCount();

	}

}
