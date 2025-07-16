import { Calendar, Gift } from 'lucide-react';

const BirthdayCard = ({ staff }) => {
  const getUpcomingBirthdays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    
    return staff
      .filter(member => member.dateOfBirth && member.status === 'Active')
      .map(member => {
        const birthDate = new Date(member.dateOfBirth);
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();
        
        // Calculate days until birthday
        let daysUntil;
        const thisYearBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
        
        if (thisYearBirthday < today) {
          // Birthday already passed this year, calculate for next year
          const nextYearBirthday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
          daysUntil = Math.ceil((nextYearBirthday - today) / (1000 * 60 * 60 * 24));
        } else {
          daysUntil = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));
        }
        
        return {
          ...member,
          daysUntil,
          isToday: birthMonth === currentMonth && birthDay === currentDate
        };
      })
      .filter(member => member.daysUntil <= 30) // Show birthdays in next 30 days
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5); // Show only top 5
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  if (upcomingBirthdays.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
          <Gift className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">Upcoming Birthdays</h3>
      </div>
      
      <div className="space-y-3">
        {upcomingBirthdays.map((member) => (
          <div key={member.id} className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm opacity-90">{member.designation}</div>
              </div>
            </div>
            <div className="text-right">
              {member.isToday ? (
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                  Today! 🎉
                </span>
              ) : (
                <span className="text-sm">
                  {member.daysUntil === 1 ? 'Tomorrow' : `${member.daysUntil} days`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayCard;