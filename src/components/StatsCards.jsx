import { Users, UserCheck, UserX, Clock } from 'lucide-react';

const StatsCards = ({ staff }) => {
  const totalStaff = staff.length;
  const activeStaff = staff.filter(member => member.status === 'Active').length;
  const leftStaff = staff.filter(member => member.status === 'Left').length;

  const getTodaysBirthday = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    return staff.find(member => {
      if (!member.dateOfBirth || member.status !== 'Active') return false;
      const birthDate = new Date(member.dateOfBirth);
      return birthDate.getMonth() === currentMonth && birthDate.getDate() === currentDate;
    });
  };

  const todaysBirthday = getTodaysBirthday();

  const lastAdded = staff.length > 0
    ? staff.reduce((latest, current) =>
        new Date(current.dateOfJoining) > new Date(latest.dateOfJoining) ? current : latest
      )
    : null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const stats = [
    {
      title: 'Total Staff',
      value: totalStaff,
      icon: Users,
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Staff',
      value: activeStaff,
      icon: UserCheck,
      color: 'bg-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Left Staff',
      value: leftStaff,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      title: todaysBirthday ? `🎉 ${todaysBirthday.name}` : (lastAdded ? lastAdded.name : 'No Staff'),
      value: todaysBirthday
        ? `Birthday Today! (${todaysBirthday.staffId})`
        : (lastAdded ? `Last Added (${formatDate(lastAdded.dateOfJoining)})` : 'Add your first staff member'),
      icon: Clock,
      color: todaysBirthday ? 'bg-yellow-500' : 'bg-purple-600',
      textColor: todaysBirthday ? 'text-yellow-600' : 'text-purple-600',
      isSpecial: true
    }
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow flex flex-col"
        >
          <div className="flex items-center space-x-3 mb-3 min-w-0">
            <div className={`p-2 lg:p-3 rounded-lg flex-shrink-0 ${stat.color}`}>
              <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h3
              className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 truncate flex-1 min-w-0"
              title={stat.title}
            >
              {stat.title}
            </h3>
          </div>

          {stat.isSpecial ? (
            <div className="space-y-1">
              <div
                className={`text-base lg:text-lg font-bold truncate ${
                  todaysBirthday
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-900 dark:text-white'
                }`}
                title={todaysBirthday ? `🎉 ${todaysBirthday.name}` : (lastAdded ? lastAdded.name : 'No Staff')}
              >
                {todaysBirthday ? `🎉 ${todaysBirthday.name}` : (lastAdded ? lastAdded.name : 'No Staff')}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate" title={stat.value}>
                {stat.value}
              </div>
            </div>
          ) : (
            <div className={`text-2xl lg:text-3xl font-bold ${stat.textColor} dark:text-white`}>
              {stat.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
