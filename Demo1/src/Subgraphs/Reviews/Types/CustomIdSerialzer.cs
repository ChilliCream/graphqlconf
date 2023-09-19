using System.Text;

namespace Demo.Reviews.Types;

public class CustomIdSerialzer : IIdSerializer
{
    public IdValue Deserialize(string serializedId)
    {
        var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(serializedId));
        var parts = decoded.Split(':');
        return new IdValue(null, parts[0], parts[1]);
    }

    public string? Serialize<T>(string? schemaName, string typeName, T id)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes($"{typeName}:{id}"));
    }
}