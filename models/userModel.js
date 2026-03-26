const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = path.join(__dirname, '../data/users.json');

class UserModel {
  // Read all users from the file
  static async readData() {
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If file doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  // Write users to the file
  static async writeData(users) {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');
  }

  // Get all users with filtering, sorting, and pagination
  static async findAll(query = {}) {
    let users = await this.readData();

    // Filtering by search (name or email)
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (query.sort) {
      const { sort, order = 'asc' } = query;
      users.sort((a, b) => {
        if (a[sort] < b[sort]) return order === 'asc' ? -1 : 1;
        if (a[sort] > b[sort]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 0; // 0 means no limit if not specified
    const total = users.length;
    
    if (limit > 0) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      users = users.slice(startIndex, endIndex);
    }

    return {
      data: users,
      pagination: limit > 0 ? {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      } : null
    };
  }

  // Get user by ID
  static async findById(id) {
    const users = await this.readData();
    return users.find(user => user.id === id) || null;
  }

  // Get user by Email
  static async findByEmail(email) {
    const users = await this.readData();
    return users.find(user => user.email === email) || null;
  }

  // Create new user
  static async create(userData) {
    const users = await this.readData();
    
    const newUser = {
      id: uuidv4(),
      ...userData
    };
    
    users.push(newUser);
    await this.writeData(users);
    
    return newUser;
  }

  // Update existing user
  static async update(id, updateData) {
    const users = await this.readData();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updateData };
    await this.writeData(users);
    
    return users[index];
  }

  // Delete user
  static async delete(id) {
    let users = await this.readData();
    const initialLength = users.length;
    
    users = users.filter(user => user.id !== id);
    
    if (users.length === initialLength) return false;
    
    await this.writeData(users);
    return true;
  }
}

module.exports = UserModel;
