using Microsoft.EntityFrameworkCore;
using BestPolicyReport.Data;
using BestPolicyReport.Services.DailyPolicyService;
using BestPolicyReport.Services.BillService;
using BestPolicyReport.Services.CashierService;
using BestPolicyReport.Services.OutputVatCommInService;
using BestPolicyReport.Services.OutputVatOvInService;
using BestPolicyReport.Services.ArApService;
using BestPolicyReport.Services.WhtService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IDailyPolicyService, DailyPolicyService>();
builder.Services.AddScoped<IBillService, BillService>();
builder.Services.AddScoped<ICashierService, CashierService>();
builder.Services.AddScoped<IOutputVatCommInService, OutputVatCommInService>();
builder.Services.AddScoped<IOutputVatOvInService, OutputVatOvInService>();
builder.Services.AddScoped<IArApService, ArApService>();
builder.Services.AddScoped<IWhtService, WhtService>();
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Amitydb")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(); 

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
