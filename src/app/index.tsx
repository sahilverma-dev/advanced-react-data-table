import { DateRangePicker } from "@/components/ui/date-range-picker";
// import { generateData } from "@/data";

const App = () => {
  // const users = generateData(100);
  // console.log(users);

  const today = new Date();
  return (
    <div>
      <DateRangePicker
        showCompare={false}
        initialDateFrom={today}
        maxDate={today}
        align="center"
        onUpdate={({ range }) => {
          console.log(range);
        }}
      />
    </div>
  );
};

export default App;
