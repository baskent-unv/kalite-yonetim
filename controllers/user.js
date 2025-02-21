import { Op } from "sequelize";
import Title from "../models/titles.js";
import Units from "../models/units.js";
import User from "../models/users.js";
import Workplaces from "../models/workplaces.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcryptjs"
import { logError } from "../utils/logger.js";
