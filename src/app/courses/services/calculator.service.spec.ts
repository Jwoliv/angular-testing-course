import {CalculatorService} from "./calculator.service";
import {LoggerService} from "./logger.service";
import SpyObj = jasmine.SpyObj;
import {TestBed} from "@angular/core/testing";

describe('CalculatorService', () => {
  let logger: SpyObj<LoggerService>;
  let service: CalculatorService;

  beforeEach(() => {
    logger = jasmine.createSpyObj(LoggerService, ["log"]);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: logger},
      ]
    })
    service = TestBed.inject(CalculatorService);
  })

  it('should add two values', () => {
    expect(service.add(4, 5)).toBe(9);
    expect(logger.log).toHaveBeenCalledOnceWith('Addition operation called')
  });

  it('should subtract two values', () => {
    expect(service.subtract(4, 5)).toBe(-1);
    expect(logger.log).toHaveBeenCalledOnceWith("Subtraction operation called")
  });

})
