export const formatLocalDate = (dateStr: string) => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return dateStr; // fallback to original string if parsing fails
  }
};

export const logEnvironment = () => {
  const env = import.meta.env.MODE;
  const styles: Record<string, string> = {
    development: 'color: white; background: teal; padding: 2px 6px; border-radius: 4px; font-weight: bold',
    staging: 'color: black; background: gold; padding: 2px 6px; border-radius: 4px; font-weight: bold',
    production: 'color: white; background: crimson; padding: 2px 6px; border-radius: 4px; font-weight: bold'
  };
  console.log(`%cEnvironment is ${env}`, styles[env] || ''); // keep the console.log here!
};
